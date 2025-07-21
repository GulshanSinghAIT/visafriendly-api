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
      // If the column already exists, that's fine - just log it
      console.log('Column Summary already exists, skipping addition');
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
