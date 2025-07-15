"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('PastPayments', 'paymentID', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Dodo Payments payment/subscription ID'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('PastPayments', 'paymentID');
  },
}; 