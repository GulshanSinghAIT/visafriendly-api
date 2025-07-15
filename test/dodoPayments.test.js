const request = require('supertest');
const app = require('../src/app');
const { dodopayments } = require('../src/config/dodoPayments');
const {
  validatePaymentData,
  formatPaymentAmount,
  createCustomerData,
  createPaymentMetadata,
  handleDodoPaymentError
} = require('../src/utils/dodoPaymentsUtils');

// Mock Dodo Payments for testing
jest.mock('../src/config/dodoPayments', () => ({
  dodopayments: {
    payments: {
      create: jest.fn(),
      retrieve: jest.fn(),
      refund: jest.fn()
    }
  }
}));

describe('Dodo Payments Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Payment Intent Creation', () => {
    it('should create payment intent successfully', async () => {
      // Mock successful payment creation
      const mockPaymentSession = {
        id: 'test_payment_id',
        checkout_url: 'https://checkout.dodopayments.com/test',
        status: 'pending'
      };
      dodopayments.payments.create.mockResolvedValue(mockPaymentSession);

      const paymentData = {
        email: 'test@example.com',
        planId: 2,
        planType: 'MONTHLY',
        amount: '9.99'
      };

      const response = await request(app)
        .post('/pricing/create-payment-intent')
        .send(paymentData)
        .expect(200);

      expect(response.body).toHaveProperty('checkoutUrl');
      expect(response.body).toHaveProperty('paymentId');
      expect(dodopayments.payments.create).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 9.99,
          currency: 'USD',
          description: expect.stringContaining('VisaFriendly Plus')
        })
      );
    });

    it('should validate payment data', async () => {
      const invalidData = {
        email: 'invalid-email',
        planId: 'invalid',
        planType: 'INVALID',
        amount: '-10'
      };

      const response = await request(app)
        .post('/pricing/create-payment-intent')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toBeInstanceOf(Array);
    });
  });

  describe('Webhook Processing', () => {
    it('should process successful payment webhook', async () => {
      const webhookData = {
        id: 'test_payment_id',
        status: 'completed',
        amount: 999,
        currency: 'USD',
        customer: {
          email: 'test@example.com'
        },
        metadata: {
          planId: 2,
          userId: 1
        }
      };

      const response = await request(app)
        .post('/pricing/webhook')
        .send(webhookData)
        .expect(200);

      expect(response.body.message).toBe('Webhook processed successfully');
    });

    it('should handle failed payment webhook', async () => {
      const webhookData = {
        id: 'test_payment_id',
        status: 'failed',
        amount: 999,
        currency: 'USD'
      };

      const response = await request(app)
        .post('/pricing/webhook')
        .send(webhookData)
        .expect(200);

      expect(response.body.message).toBe('Webhook processed successfully');
    });
  });

  describe('Utility Functions', () => {
    describe('validatePaymentData', () => {
      it('should validate correct payment data', () => {
        const validData = {
          email: 'test@example.com',
          planId: 2,
          planType: 'MONTHLY',
          amount: '9.99'
        };

        const result = validatePaymentData(validData);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('should reject invalid email', () => {
        const invalidData = {
          email: 'invalid-email',
          planId: 2,
          planType: 'MONTHLY',
          amount: '9.99'
        };

        const result = validatePaymentData(invalidData);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Valid email is required');
      });

      it('should reject invalid amount', () => {
        const invalidData = {
          email: 'test@example.com',
          planId: 2,
          planType: 'MONTHLY',
          amount: '-10'
        };

        const result = validatePaymentData(invalidData);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Valid amount is required');
      });
    });

    describe('formatPaymentAmount', () => {
      it('should format valid amount', () => {
        expect(formatPaymentAmount('9.99')).toBe(9.99);
        expect(formatPaymentAmount(10)).toBe(10);
        expect(formatPaymentAmount('10.50')).toBe(10.5);
      });

      it('should throw error for invalid amount', () => {
        expect(() => formatPaymentAmount('invalid')).toThrow('Invalid amount provided');
        expect(() => formatPaymentAmount(-10)).toThrow('Invalid amount provided');
        expect(() => formatPaymentAmount(0)).toThrow('Invalid amount provided');
      });
    });

    describe('createCustomerData', () => {
      it('should create customer data from user object', () => {
        const user = {
          id: 1,
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          phone: '1234567890'
        };

        const customerData = createCustomerData(user);
        expect(customerData).toEqual({
          email: 'test@example.com',
          name: 'John Doe',
          phone: '1234567890',
          metadata: {
            userId: 1,
            userType: 'customer'
          }
        });
      });

      it('should handle missing user fields', () => {
        const user = {
          id: 1,
          email: 'test@example.com'
        };

        const customerData = createCustomerData(user);
        expect(customerData.name).toBe('');
        expect(customerData.phone).toBe('');
      });
    });

    describe('handleDodoPaymentError', () => {
      it('should handle invalid amount error', () => {
        const error = { code: 'INVALID_AMOUNT' };
        const result = handleDodoPaymentError(error);
        
        expect(result.message).toBe('Invalid payment amount');
        expect(result.code).toBe('INVALID_AMOUNT');
        expect(result.statusCode).toBe(400);
      });

      it('should handle generic error', () => {
        const error = { message: 'Unknown error' };
        const result = handleDodoPaymentError(error);
        
        expect(result.message).toBe('Payment service temporarily unavailable');
        expect(result.code).toBe('SERVICE_ERROR');
        expect(result.statusCode).toBe(500);
      });
    });
  });

  describe('Payment Details', () => {
    it('should retrieve payment details', async () => {
      const mockPayment = {
        id: 'test_payment_id',
        status: 'completed',
        amount: 999,
        currency: 'USD'
      };
      dodopayments.payments.retrieve.mockResolvedValue(mockPayment);

      const response = await request(app)
        .get('/pricing/payment/test_payment_id')
        .expect(200);

      expect(response.body).toHaveProperty('payment');
      expect(response.body.payment.id).toBe('test_payment_id');
    });
  });

  describe('Refund Payment', () => {
    it('should process refund successfully', async () => {
      const mockRefund = {
        id: 'refund_id',
        amount: 999,
        status: 'completed'
      };
      dodopayments.payments.refund.mockResolvedValue(mockRefund);

      const refundData = {
        paymentId: 'test_payment_id',
        amount: '9.99',
        reason: 'Customer request'
      };

      const response = await request(app)
        .post('/pricing/refund')
        .send(refundData)
        .expect(200);

      expect(response.body).toHaveProperty('refund');
      expect(response.body.message).toBe('Refund processed successfully');
    });
  });
}); 