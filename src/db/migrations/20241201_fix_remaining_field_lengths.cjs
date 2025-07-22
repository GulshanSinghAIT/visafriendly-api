'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Convert fields that might contain very long content to TEXT type
    // This will handle any length of content without restrictions
    
    await queryInterface.changeColumn('jobs', 'companyName', {
      type: Sequelize.TEXT,
      allowNull: false
    });

    await queryInterface.changeColumn('jobs', 'jobTitle', {
      type: Sequelize.TEXT,
      allowNull: false
    });

    await queryInterface.changeColumn('jobs', 'minExperience', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.changeColumn('jobs', 'location', {
      type: Sequelize.TEXT,
      allowNull: false
    });

    await queryInterface.changeColumn('jobs', 'jobType', {
      type: Sequelize.TEXT,
      allowNull: false
    });

    await queryInterface.changeColumn('jobs', 'workSetting', {
      type: Sequelize.TEXT,
      allowNull: false
    });

    await queryInterface.changeColumn('jobs', 'sponsorType', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    console.log('✅ All string fields converted to TEXT type for unlimited length');
  },

  async down(queryInterface, Sequelize) {
    // Revert back to VARCHAR(255) if needed
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

    console.log('✅ Fields reverted to VARCHAR(255)');
  }
}; 