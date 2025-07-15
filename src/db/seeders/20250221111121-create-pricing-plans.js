'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add pricing plans to the CurrentPlans table
    await queryInterface.bulkInsert('CurrentPlans', [
      {
        id: 1,
        planName: 'Free Plan',
        planType: 'FREE',
        price: '0.00',
        billingCycle: 1,
        basicDescription: 'Basic features for free users',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        planName: 'VisaFriendly Plus - Monthly',
        planType: 'MONTHLY',
        price: '9.99',
        billingCycle: 1,
        basicDescription: 'Premium features with monthly billing',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        planName: 'VisaFriendly Plus - 2 Months',
        planType: 'QUARTERLY',
        price: '15.98',
        billingCycle: 2,
        basicDescription: 'Premium features with 2-month billing (Save 20%)',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        planName: 'VisaFriendly Plus - 3 Months',
        planType: 'QUARTERLY',
        price: '20.97',
        billingCycle: 3,
        basicDescription: 'Premium features with 3-month billing (Save 30%)',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the pricing plans
    await queryInterface.bulkDelete('CurrentPlans', {
      id: [1, 2, 3, 4]
    }, {});
  }
}; 