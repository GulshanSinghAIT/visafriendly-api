'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.removeColumn('Address', 'zipCode');
      await queryInterface.removeColumn('Address', 'street');
    } catch (error) {
      console.error('Migration error:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.addColumn('Address', 'zipCode', {
        type: Sequelize.STRING,
        allowNull: false
      });
      await queryInterface.addColumn('Address', 'street', {
        type: Sequelize.STRING,
        allowNull: false
      });
    } catch (error) {
      console.error('Migration error:', error);
      throw error;
    }
  }
};
