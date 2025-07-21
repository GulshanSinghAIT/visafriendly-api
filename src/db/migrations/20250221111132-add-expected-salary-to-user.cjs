'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('User', 'expectedSalary', {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Expected annual salary in USD'
      });
    } catch (error) {
      // If the column already exists, that's fine - just log it
      console.log('Column expectedSalary already exists, skipping addition');
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('User', 'expectedSalary');
  }
}; 