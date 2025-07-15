'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('User', 'expectedSalary', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Expected annual salary in USD'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('User', 'expectedSalary');
  }
}; 