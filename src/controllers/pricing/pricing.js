const User = require("../../db/models/user.js");
const CurrentPlans = require("../../db/models/currentPlan.js");
const PastPayment = require("../../db/models/paymentHistory.js");
const { dodopayments } = require("../../config/dodoPayments.js");
const {
  validatePaymentData,
  formatPaymentAmount,
  createCustomerData,
  createPaymentMetadata,
  handleDodoPaymentError,
  verifyWebhookSignature
} = require("../../utils/dodoPaymentsUtils.js");

/**
 * Create a payment intent using Dodo Payments with product ID
 * This function creates a payment session using Dodo product IDs
 */
const PaymentIntent = async (req, res) => {
  const { email, dodoProductId, planName, amount, redirectUrl } = req.body;

  try {
    // Validate payment data using utility function
    const validation = validatePaymentData({ 
      email, 
      dodoProductId, // Pass the Dodo product ID directly
      planType: 'DODO_PRODUCT', // Use DODO_PRODUCT type
      amount 
    });
    if (!validation.isValid) {
      return res.status(400).json({ 
        message: "Invalid payment data",
        errors: validation.errors
      });
    }

    // Find user by email (optional - we can work without it)
    const user = await User.findOne({ where: { email } });

    // Create a pending payment record in our database
    const pastPayment = await PastPayment.create({
      userId: user ? user.id : null, // Use null if user not found
      plan: planName || `Dodo Product ${dodoProductId}`,
      amount: amount,
      status: "PENDING",
      billingDate: new Date(),
    });

    // Prepare subscription data for Dodo Payments using the correct API structure
    const subscriptionData = {
      billing: {
        city: "",
        country: "US",
        state: "",
        street: "",
        zipcode: "",
      },
      customer: {
        email: email,
        name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Customer',
      },
      payment_link: true,
      product_id: dodoProductId,
      quantity: 1,
      return_url: redirectUrl || `${process.env.CLIENT_URL}/profile/subscription?id=${dodoProductId}&payment_id={payment_id}&subscription_id={subscription_id}&status={status}`,
      metadata: {
        email: email, // Use email instead of userId
        planId: dodoProductId,
        planType: 'DODO_PRODUCT',
        paymentRecordId: pastPayment.id.toString(),
        source: 'visafriendly_web',
        timestamp: new Date().toISOString()
      }
    };

    // Create subscription with Dodo Payments using the correct API
    const subscriptionSession = await dodopayments.subscriptions.create(subscriptionData);

    // Store the payment ID (if available) or subscription ID as fallback
    // The payment ID might be available in the subscription response
    const paymentIdToStore = subscriptionSession.payment_id || subscriptionSession.id;

    // Update payment record with payment ID (or subscription ID as fallback)
    await pastPayment.update({
      paymentID: paymentIdToStore,
    });

    res.status(200).json({
      message: "Payment intent created successfully",
      paymentIntentId: pastPayment.id,
      checkoutUrl: subscriptionSession.payment_link || subscriptionSession.checkout_url,
      paymentId: paymentIdToStore, // Return the payment ID we're storing
    });

  } catch (error) {
    console.error("Payment intent creation error:", error);
    
    // Handle Dodo Payments specific errors
    const dodoError = handleDodoPaymentError(error);
    res.status(dodoError.statusCode).json({
      message: dodoError.message,
      code: dodoError.code,
      error: error.message,
    });
  }
};

/**
 * Handle Dodo Payments webhook
 * This endpoint receives payment status updates from Dodo Payments
 */
const PaymentWebhook = async (req, res) => {
  try {
    console.log("🔔 Webhook received - Full payload:", JSON.stringify(req.body, null, 2));
    console.log("🔔 Webhook headers:", req.headers);

    // Verify webhook signature in production
    if (process.env.NODE_ENV === 'production') {
      const signature = req.headers['x-dodo-signature'];
      const webhookSecret = process.env.DODO_WEBHOOK_SECRET;
      
      if (!signature || !webhookSecret) {
        console.warn("Webhook signature verification failed - missing signature or secret");
        return res.status(401).json({ message: "Invalid webhook signature" });
      }

      const isValid = verifyWebhookSignature(req.body, signature, webhookSecret);
      if (!isValid) {
        console.warn("Invalid webhook signature received");
        return res.status(401).json({ message: "Invalid webhook signature" });
      }
    }

    const { 
      id, 
      status, 
      amount, 
      currency, 
      customer, 
      metadata,
      type, // Event type (payment, subscription, etc.)
      object // Object type
    } = req.body;

    console.log("🔔 Webhook parsed data:", { 
      id, 
      status, 
      amount, 
      currency, 
      customer: customer?.email, 
      type,
      object,
      metadata 
    });

    // Handle different types of webhook events
    if (type === 'subscription.created' || type === 'subscription.updated' || type === 'subscription.completed') {
      console.log("📅 Processing subscription webhook");
      
      // For subscription events, we need to find the payment record by subscription ID
      const pastPayment = await PastPayment.findOne({
        where: { paymentID: id }
      });

      if (!pastPayment) {
        console.error("❌ Payment record not found for subscription ID:", id);
        console.log("🔍 Available payment records with paymentID:", await PastPayment.findAll({
          attributes: ['id', 'paymentID', 'plan', 'status']
        }));
        return res.status(404).json({ message: "Payment record not found for subscription" });
      }

      console.log("✅ Found payment record:", pastPayment.id);

      // Update payment status based on subscription status
      switch (status) {
        case 'active':
        case 'completed':
          pastPayment.status = "PAID";
          await pastPayment.save();
          console.log("✅ Payment marked as PAID");

          // Update user's current plan if user exists
          if (pastPayment.userId) {
            // Find the corresponding plan and update user
            const plan = await CurrentPlans.findOne({
              where: { planName: pastPayment.plan },
            });

            if (plan) {
              await User.update(
                { currentPlanId: plan.id },
                { where: { id: pastPayment.userId } }
              );
              console.log("✅ User plan updated to:", plan.planName);
            }
          }
          break;

        case 'cancelled':
        case 'failed':
          pastPayment.status = "FAILED";
          await pastPayment.save();
          console.log("❌ Payment marked as FAILED");
          break;

        default:
          console.log("⚠️ Unhandled subscription status:", status);
      }

    } else if (type === 'payment.completed' || type === 'payment.failed') {
      console.log("💳 Processing payment webhook");
      
      // For payment events, find by payment ID
      const pastPayment = await PastPayment.findOne({
        where: { paymentID: id }
      });

      if (!pastPayment) {
        console.error("❌ Payment record not found for payment ID:", id);
        return res.status(404).json({ message: "Payment record not found for payment" });
      }

      // Update payment status
      switch (status) {
        case 'completed':
          pastPayment.status = "PAID";
          await pastPayment.save();
          console.log("✅ Payment marked as PAID");
          break;

        case 'failed':
          pastPayment.status = "FAILED";
          await pastPayment.save();
          console.log("❌ Payment marked as FAILED");
          break;

        default:
          console.log("⚠️ Unhandled payment status:", status);
      }
    } else {
      console.log("⚠️ Unhandled webhook type:", type);
      // Still try to process as a generic event
      const pastPayment = await PastPayment.findOne({
        where: { paymentID: id }
      });

      if (pastPayment) {
        console.log("✅ Found payment record for generic event");
        if (status === 'active' || status === 'completed') {
          pastPayment.status = "PAID";
          await pastPayment.save();
        }
      }
    }

    res.status(200).json({ message: "Webhook processed successfully" });

  } catch (error) {
    console.error("❌ Webhook processing error:", error);
    res.status(500).json({
      message: "Error processing webhook",
      error: error.message,
    });
  }
};

/**
 * Confirm payment manually (fallback method)
 * This can be used if webhook fails or for manual confirmation
 */
const PaymentConfirm = async (req, res) => {
  const { paymentIntentId, paymentStatus, dodoPaymentId } = req.body;

  try {
    // Find the payment record
    const pastPayment = await PastPayment.findByPk(paymentIntentId);

    if (!pastPayment) {
      return res.status(404).json({ message: "Payment intent not found" });
    }

    // If Dodo payment ID is provided, verify with Dodo Payments
    if (dodoPaymentId) {
      try {
        const dodoPayment = await dodopayments.payments.retrieve(dodoPaymentId);
        
        if (dodoPayment.status === 'completed') {
          paymentStatus = 'SUCCESS';
        } else if (dodoPayment.status === 'failed') {
          paymentStatus = 'FAILED';
        }
      } catch (dodoError) {
        console.error("Error retrieving Dodo payment:", dodoError);
      }
    }

    // Update payment status
    if (paymentStatus === "SUCCESS") {
      pastPayment.status = "PAID";
      await pastPayment.save();

      // Find the corresponding plan and update user
      const plan = await CurrentPlans.findOne({
        where: { planName: pastPayment.plan },
      });

      if (plan) {
      await User.update(
        { currentPlanId: plan.id },
        { where: { id: pastPayment.userId } }
      );
      }

      res.status(200).json({ message: "Payment confirmed successfully" });
    } else {
      pastPayment.status = "FAILED";
      await pastPayment.save();
      res.status(400).json({ message: "Payment failed" });
    }
  } catch (error) {
    console.error("Payment confirmation error:", error);
    res.status(500).json({
      message: "Error confirming payment",
      error: error.message,
    });
  }
};

/**
 * Get payment details from Dodo Payments
 */
const GetPaymentDetails = async (req, res) => {
  const { paymentId } = req.params;

  try {
    const payment = await dodopayments.payments.retrieve(paymentId);
    
    res.status(200).json({
      payment: payment,
    });
  } catch (error) {
    console.error("Error retrieving payment details:", error);
    res.status(500).json({
      message: "Error retrieving payment details",
      error: error.message,
    });
  }
};

/**
 * Refund a payment
 */
const RefundPayment = async (req, res) => {
  const { paymentId, amount, reason } = req.body;

  try {
    const refundData = {
      amount: amount, // Optional: if not provided, full amount will be refunded
      reason: reason || "Customer request",
    };

    const refund = await dodopayments.payments.refund(paymentId, refundData);

    // Update payment record status
    const pastPayment = await PastPayment.findOne({
      where: { paymentID: paymentId }
    });

    if (pastPayment) {
      pastPayment.status = "REFUNDED";
      await pastPayment.save();
    }

    res.status(200).json({
      message: "Refund processed successfully",
      refund: refund,
    });
  } catch (error) {
    console.error("Refund error:", error);
    res.status(500).json({
      message: "Error processing refund",
      error: error.message,
    });
  }
};

module.exports = {
  PaymentIntent,
  PaymentWebhook,
  PaymentConfirm,
  GetPaymentDetails,
  RefundPayment,
};
