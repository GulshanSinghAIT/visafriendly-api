'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('H1bSponsorCases', 'Location', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('H1bSponsorCases', 'Location', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  }
}; 