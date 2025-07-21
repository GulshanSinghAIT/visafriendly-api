"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.addColumn("User", "referralSource", {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "Other", // Set a default value for existing records
      });
    } catch (error) {
      // If the column already exists, that's fine - just log it
      console.log('Column referralSource already exists, skipping addition');
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("User", "referralSource");
  },
}; 