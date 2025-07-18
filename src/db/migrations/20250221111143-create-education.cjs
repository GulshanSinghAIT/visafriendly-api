'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('educations', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      school: {
        type: Sequelize.STRING,
        allowNull: false
      },
      major: {
        type: Sequelize.STRING,
        allowNull: false
      },
      degree: {
        type: Sequelize.STRING,
        allowNull: false
      },
      gpa: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      startMonth: {
        type: Sequelize.STRING,
        allowNull: false
      },
      startYear: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      endMonth: {
        type: Sequelize.STRING,
        allowNull: false
      },
      endYear: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Add indexes
    await queryInterface.addIndex('educations', ['userId']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('educations');
  }
}; 