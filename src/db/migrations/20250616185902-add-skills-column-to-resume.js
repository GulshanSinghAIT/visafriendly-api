'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.addColumn('Resume', 'skills', {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      });
    } catch (error) {
      console.error('Migration error:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.removeColumn('Resume', 'skills');
    } catch (error) {
      console.error('Migration error:', error);
      throw error;
    }
  }
};
