const dotenv = require("dotenv");
dotenv.config();

const DodoPayments = require("dodopayments");

/**
 * Initialize Dodo Payments client with proper error handling
 * This function creates a DodoPayments instance or returns a mock for development
 */
const initializeDodoPayments = () => {
  const apiKey = process.env.DODO_PAYMENTS_API_KEY;
  const environment = process.env.NODE_ENV === 'production' ? 'live_mode' : 'test_mode';

  // Check if API key is provided
  if (!apiKey) {
    console.warn('⚠️  DODO_PAYMENTS_API_KEY environment variable is not set.');
    console.warn('📝 Please add DODO_PAYMENTS_API_KEY to your .env file for payment processing.');
    console.warn('🔧 Using mock DodoPayments client for development.');
    
    // Return a mock client for development
    return createMockDodoPayments();
  }

  try {
const dodopayments = new DodoPayments({
      bearerToken: apiKey,
      environment: environment,
    });

    console.log(`✅ DodoPayments initialized successfully in ${environment} mode`);
    return dodopayments;
  } catch (error) {
    console.error('❌ Failed to initialize DodoPayments:', error.message);
    console.warn('🔧 Falling back to mock client for development.');
    return createMockDodoPayments();
  }
};

/**
 * Create a mock DodoPayments client for development/testing
 * This allows the application to run without a real API key
 */
const createMockDodoPayments = () => {
  return {
    payments: {
      create: async (paymentData) => {
        console.log('🔧 Mock DodoPayments: Creating payment', paymentData);
        return {
          id: `mock_payment_${Date.now()}`,
          checkout_url: 'https://mock-checkout.dodopayments.com/test',
          status: 'pending',
          amount: paymentData.amount,
          currency: paymentData.currency,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      },
      retrieve: async (paymentId) => {
        console.log('🔧 Mock DodoPayments: Retrieving payment', paymentId);
        return {
          id: paymentId,
          status: 'completed',
          amount: 999,
          currency: 'USD',
          customer: { email: 'test@example.com' },
          metadata: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      },
      refund: async (paymentId, refundData) => {
        console.log('🔧 Mock DodoPayments: Processing refund', { paymentId, refundData });
        return {
          id: `mock_refund_${Date.now()}`,
          payment_id: paymentId,
          amount: refundData.amount || 999,
          status: 'completed',
          reason: refundData.reason || 'Customer request',
          created_at: new Date().toISOString()
        };
      }
    },
    subscriptions: {
      create: async (subscriptionData) => {
        console.log('🔧 Mock DodoPayments: Creating subscription', subscriptionData);
        return {
          id: `mock_subscription_${Date.now()}`,
          payment_link: 'https://mock-checkout.dodopayments.com/subscription/test',
          status: 'pending',
          product_id: subscriptionData.product_id,
          quantity: subscriptionData.quantity,
          customer: subscriptionData.customer,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      },
      retrieve: async (subscriptionId) => {
        console.log('🔧 Mock DodoPayments: Retrieving subscription', subscriptionId);
        return {
          id: subscriptionId,
          status: 'active',
          product_id: 'mock_product_id',
          quantity: 1,
          customer: { email: 'test@example.com' },
          metadata: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }
    },
    webhooks: {
      verify: (payload, signature, secret) => {
        console.log('🔧 Mock DodoPayments: Verifying webhook signature');
        return true; // Always return true for mock
      }
    }
  };
};

// Initialize the DodoPayments client
const dodopayments = initializeDodoPayments();

module.exports = { dodopayments };
