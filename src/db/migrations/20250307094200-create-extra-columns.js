'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('extraColumns', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
      columnName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      columnType: {
        allowNull: false,
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('extraColumns');
  }
};