"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("OpenRole", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      yearsOfExperience: {
        type: Sequelize.STRING,
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
      },
    });

    // Create Join Table for User <-> OpenRole Many-to-Many Relationship with yearsOfExperience
    await queryInterface.createTable("UserOpenRole", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "User",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      openRoleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "OpenRole",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      yearsOfExperience: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });

    // Add unique constraint to prevent duplicate user-role pairs
    await queryInterface.addConstraint("UserOpenRole", {
      fields: ["userId", "openRoleId"],
      type: "unique",
      name: "unique_user_role_constraint",
    });
  },
  async down(queryInterface, Sequelize) {
    // Remove the unique constraint before dropping the table
    await queryInterface.removeConstraint(
      "UserOpenRole",
      "unique_user_role_constraint"
    );
    await queryInterface.dropTable("UserOpenRole");
    await queryInterface.dropTable("OpenRole");
  },
};
