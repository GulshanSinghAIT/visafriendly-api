'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.addColumn('WorkExperience', 'companyDomain', {
        type: Sequelize.STRING,
        allowNull: true
      });
    } catch (error) {
      console.error('Migration error:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.removeColumn('WorkExperience', 'companyDomain');
    } catch (error) {
      console.error('Migration error:', error);
      throw error;
    }
  }
};
