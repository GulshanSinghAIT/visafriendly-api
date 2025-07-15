const express = require("express");
const router = express.Router();

const {
  PaymentIntent,
  PaymentWebhook,
  PaymentConfirm,
  GetPaymentDetails,
  RefundPayment,
} = require("../../controllers/pricing/pricing.js");
const { GetCurrentPlan } = require("../../controllers/pricing/getCurrentPlan.js");
const {
  GetPaymentHistory,
} = require("../../controllers/pricing/getPaymentHistory.js");
const { UpdatePlan } = require("../../controllers/pricing/updatePlan.js");

// Dodo Payments routes
router.post("/create-payment-intent", PaymentIntent);
router.post("/webhook", PaymentWebhook); // Webhook endpoint for Dodo Payments
router.post("/confirm-payment", PaymentConfirm);
router.get("/payment/:paymentId", GetPaymentDetails); // Get payment details from Dodo
router.post("/refund", RefundPayment); // Refund a payment

// Existing routes
router.get("/current-plan", GetCurrentPlan);
router.get("/payment-history", GetPaymentHistory);
router.post("/updatePlans", UpdatePlan);

module.exports = router;
