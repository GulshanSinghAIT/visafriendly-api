"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add referralCode column
    await queryInterface.addColumn("User", "referralCode", {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    });

    // Add referredBy column
    await queryInterface.addColumn("User", "referredBy", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "User",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    // Add index for referralCode for faster lookups
    await queryInterface.addIndex("User", ["referralCode"], {
      unique: true,
      name: "user_referral_code_unique",
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove index
    await queryInterface.removeIndex("User", "user_referral_code_unique");
    
    // Remove columns
    await queryInterface.removeColumn("User", "referredBy");
    await queryInterface.removeColumn("User", "referralCode");
  },
}; 