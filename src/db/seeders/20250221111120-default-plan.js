'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('CurrentPlans', [{
      id: 1,
      planName: 'Free Plan',
      planType: 'FREE',
      price: '0',
      billingCycle: 1,
      basicDescription: 'Basic features for new users',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('CurrentPlans', null, {});
  }
}; 