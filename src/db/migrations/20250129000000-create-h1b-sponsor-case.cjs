'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('H1bSponsorCases', {
      caseId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      year: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      EmployerName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      jobTitle: {
        type: Sequelize.STRING,
        allowNull: false
      },
      experienceLevel: {
        type: Sequelize.STRING,
        allowNull: false
      },
      baseSalary: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      Location: {
        type: Sequelize.STRING,
        allowNull: true
      },
      submitDate: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      startDate: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      caseStatus: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('H1bSponsorCases');
  }
}; 