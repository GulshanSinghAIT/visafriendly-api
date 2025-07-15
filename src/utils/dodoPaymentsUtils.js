const crypto = require('crypto');
const { dodopayments } = require("../config/dodoPayments.js");

/**
 * Verify webhook signature from Dodo Payments
 * @param {Object} payload - The webhook payload
 * @param {string} signature - The signature from headers
 * @param {string} secret - The webhook secret
 * @returns {boolean} - Whether the signature is valid
 */
const verifyWebhookSignature = (payload, signature, secret) => {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(payload))
      .digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch (error) {
    console.error('Webhook signature verification error:', error);
    return false;
  }
};

/**
 * Validate payment data before creating payment intent
 * @param {Object} paymentData - The payment data to validate
 * @returns {Object} - Validation result with isValid and errors
 */
const validatePaymentData = (paymentData) => {
  const errors = [];
  const { email, planId, dodoProductId, planType, amount } = paymentData;

  // Validate email
  if (!email || !email.includes('@')) {
    errors.push('Valid email is required');
  }

  // Validate plan ID or Dodo product ID
  if (!planId && !dodoProductId) {
    errors.push('Valid plan ID or Dodo product ID is required');
  }

  // Validate plan type (optional for Dodo product IDs)
  if (planType && !['FREE', 'MONTHLY', 'QUARTERLY', 'YEARLY', 'DODO_PRODUCT'].includes(planType)) {
    errors.push('Valid plan type is required');
  }

  // Validate amount
  if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
    errors.push('Valid amount is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Format payment amount for Dodo Payments
 * @param {string|number} amount - The amount to format
 * @returns {number} - Formatted amount
 */
const formatPaymentAmount = (amount) => {
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount) || numAmount <= 0) {
    throw new Error('Invalid amount provided');
  }
  return Math.round(numAmount * 100) / 100; // Round to 2 decimal places
};

/**
 * Create customer data for Dodo Payments
 * @param {Object} user - User object from database
 * @returns {Object} - Formatted customer data
 */
const createCustomerData = (user) => {
  return {
    email: user.email,
    name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
    phone: user.phone || '',
    metadata: {
      userId: user.id.toString(),
      userType: 'customer'
    }
  };
};

/**
 * Create metadata for payment tracking
 * @param {Object} paymentInfo - Payment information
 * @returns {Object} - Formatted metadata
 */
const createPaymentMetadata = (paymentInfo) => {
  return {
    userId: paymentInfo.userId.toString(),
    planId: paymentInfo.planId,
    planType: paymentInfo.planType,
    paymentRecordId: paymentInfo.paymentRecordId.toString(),
    source: 'visafriendly_web',
    timestamp: new Date().toISOString()
  };
};

/**
 * Handle Dodo Payments API errors
 * @param {Error} error - The error from Dodo Payments API
 * @returns {Object} - Formatted error response
 */
const handleDodoPaymentError = (error) => {
  console.error('Dodo Payments API Error:', error);

  // Handle specific error types
  if (error.code === 'INVALID_AMOUNT') {
    return {
      message: 'Invalid payment amount',
      code: 'INVALID_AMOUNT',
      statusCode: 400
    };
  }

  if (error.code === 'INVALID_CURRENCY') {
    return {
      message: 'Invalid currency specified',
      code: 'INVALID_CURRENCY',
      statusCode: 400
    };
  }

  if (error.code === 'PAYMENT_FAILED') {
    return {
      message: 'Payment processing failed',
      code: 'PAYMENT_FAILED',
      statusCode: 400
    };
  }

  // Default error response
  return {
    message: 'Payment service temporarily unavailable',
    code: 'SERVICE_ERROR',
    statusCode: 500
  };
};

/**
 * Get payment status from Dodo Payments
 * @param {string} paymentId - The Dodo payment ID
 * @returns {Object} - Payment status information
 */
const getPaymentStatus = async (paymentId) => {
  try {
    const payment = await dodopayments.payments.retrieve(paymentId);
    return {
      status: payment.status,
      amount: payment.amount,
      currency: payment.currency,
      customer: payment.customer,
      metadata: payment.metadata,
      createdAt: payment.created_at,
      updatedAt: payment.updated_at
    };
  } catch (error) {
    throw handleDodoPaymentError(error);
  }
};

/**
 * Create refund for a payment
 * @param {string} paymentId - The Dodo payment ID
 * @param {Object} refundData - Refund data
 * @returns {Object} - Refund information
 */
const createRefund = async (paymentId, refundData) => {
  try {
    const refund = await dodopayments.payments.refund(paymentId, {
      amount: refundData.amount,
      reason: refundData.reason || 'Customer request',
      metadata: {
        refundedBy: refundData.refundedBy || 'system',
        refundReason: refundData.reason || 'Customer request',
        timestamp: new Date().toISOString()
      }
    });

    return {
      refundId: refund.id,
      amount: refund.amount,
      status: refund.status,
      reason: refund.reason,
      createdAt: refund.created_at
    };
  } catch (error) {
    throw handleDodoPaymentError(error);
  }
};

module.exports = {
  verifyWebhookSignature,
  validatePaymentData,
  formatPaymentAmount,
  createCustomerData,
  createPaymentMetadata,
  handleDodoPaymentError,
  getPaymentStatus,
  createRefund
}; 