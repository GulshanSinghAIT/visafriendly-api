'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove the unique constraint from the year column
    await queryInterface.removeConstraint('H1bSponsorCases', 'H1bSponsorCases_year_key');
  },

  async down(queryInterface, Sequelize) {
    // Add the unique constraint back to the year column
    await queryInterface.addConstraint('H1bSponsorCases', {
      fields: ['year'],
      type: 'unique',
      name: 'H1bSponsorCases_year_key'
    });
  }
}; 