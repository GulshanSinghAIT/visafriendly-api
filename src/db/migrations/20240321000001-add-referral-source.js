"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("User", "referralSource", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "Other", // Set a default value for existing records
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("User", "referralSource");
  },
}; 