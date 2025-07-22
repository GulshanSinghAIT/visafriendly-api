'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Update field lengths to handle longer text data
    await queryInterface.changeColumn('jobs', 'companyName', {
      type: Sequelize.STRING(500),
      allowNull: false
    });

    await queryInterface.changeColumn('jobs', 'jobTitle', {
      type: Sequelize.STRING(500),
      allowNull: false
    });

    await queryInterface.changeColumn('jobs', 'minExperience', {
      type: Sequelize.STRING(500),
      allowNull: true
    });

    await queryInterface.changeColumn('jobs', 'location', {
      type: Sequelize.STRING(500),
      allowNull: false
    });

    await queryInterface.changeColumn('jobs', 'jobType', {
      type: Sequelize.STRING(100),
      allowNull: false
    });

    await queryInterface.changeColumn('jobs', 'workSetting', {
      type: Sequelize.STRING(100),
      allowNull: false
    });

    await queryInterface.changeColumn('jobs', 'sponsorType', {
      type: Sequelize.STRING(200),
      allowNull: true
    });

    console.log('✅ Field lengths updated successfully');
  },

  async down(queryInterface, Sequelize) {
    // Revert field lengths back to original
    await queryInterface.changeColumn('jobs', 'companyName', {
      type: Sequelize.STRING(255),
      allowNull: false
    });

    await queryInterface.changeColumn('jobs', 'jobTitle', {
      type: Sequelize.STRING(255),
      allowNull: false
    });

    await queryInterface.changeColumn('jobs', 'minExperience', {
      type: Sequelize.STRING(255),
      allowNull: true
    });

    await queryInterface.changeColumn('jobs', 'location', {
      type: Sequelize.STRING(255),
      allowNull: false
    });

    await queryInterface.changeColumn('jobs', 'jobType', {
      type: Sequelize.STRING(255),
      allowNull: false
    });

    await queryInterface.changeColumn('jobs', 'workSetting', {
      type: Sequelize.STRING(255),
      allowNull: false
    });

    await queryInterface.changeColumn('jobs', 'sponsorType', {
      type: Sequelize.STRING(255),
      allowNull: true
    });

    console.log('✅ Field lengths reverted');
  }
}; 