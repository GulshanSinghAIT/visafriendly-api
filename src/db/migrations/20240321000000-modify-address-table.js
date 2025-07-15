"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // First remove the columns we don't want
    await queryInterface.removeColumn("Address", "zipCode");
    await queryInterface.removeColumn("Address", "street");
  },

  async down(queryInterface, Sequelize) {
    // Add back the columns if we need to rollback
    await queryInterface.addColumn("Address", "zipCode", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn("Address", "street", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
}; 