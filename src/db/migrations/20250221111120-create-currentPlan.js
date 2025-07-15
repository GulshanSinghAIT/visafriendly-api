"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("CurrentPlans", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      planName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      planType: {
        type: Sequelize.ENUM("FREE", "MONTHLY", "QUARTERLY", "YEARLY"),
        allowNull: false,
      },
      price: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 0,
      },

      billingCycle: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },

      basicDescription: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("CurrentPlans");
  },
};
