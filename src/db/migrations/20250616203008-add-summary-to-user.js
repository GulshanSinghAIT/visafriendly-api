'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      await queryInterface.addColumn('User', 'Summary', {
        type: Sequelize.TEXT,
        allowNull: true
      });
    } catch (error) {
      console.error('Migration error:', error);
      throw error;
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      await queryInterface.removeColumn('User', 'Summary');
    } catch (error) {
      console.error('Migration error:', error);
      throw error;
    }
  }
};
