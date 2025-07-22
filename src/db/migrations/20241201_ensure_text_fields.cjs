'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Ensure jobDescription and other text fields can handle very long content
    // PostgreSQL TEXT type has no length limit, but let's make sure it's properly configured
    
    // Check if jobDescription column exists and ensure it's TEXT type
    const tableDescription = await queryInterface.describeTable('jobs');
    
    if (tableDescription.jobDescription) {
      // Ensure jobDescription is TEXT type for unlimited length
      await queryInterface.changeColumn('jobs', 'jobDescription', {
        type: Sequelize.TEXT,
        allowNull: true
      });
    }
    
    if (tableDescription.responsibilities) {
      // Ensure responsibilities is TEXT type for unlimited length
      await queryInterface.changeColumn('jobs', 'responsibilities', {
        type: Sequelize.TEXT,
        allowNull: true
      });
    }
    
    if (tableDescription.smallDescription) {
      // Ensure smallDescription is TEXT type for unlimited length
      await queryInterface.changeColumn('jobs', 'smallDescription', {
        type: Sequelize.TEXT,
        allowNull: true
      });
    }
    
    if (tableDescription.skills) {
      // Ensure skills is TEXT type for unlimited length
      await queryInterface.changeColumn('jobs', 'skills', {
        type: Sequelize.TEXT,
        allowNull: true
      });
    }
    
    if (tableDescription.tags) {
      // Ensure tags is TEXT type for unlimited length
      await queryInterface.changeColumn('jobs', 'tags', {
        type: Sequelize.TEXT,
        allowNull: true
      });
    }
    
    if (tableDescription.applyUrl) {
      // Ensure applyUrl is TEXT type for unlimited length
      await queryInterface.changeColumn('jobs', 'applyUrl', {
        type: Sequelize.TEXT,
        allowNull: true
      });
    }
    
    if (tableDescription.companyLogo) {
      // Ensure companyLogo is TEXT type for unlimited length
      await queryInterface.changeColumn('jobs', 'companyLogo', {
        type: Sequelize.TEXT,
        allowNull: true
      });
    }

    console.log('✅ Text fields configured for unlimited length');
  },

  async down(queryInterface, Sequelize) {
    // Revert text fields back to VARCHAR(255) if needed
    const tableDescription = await queryInterface.describeTable('jobs');
    
    if (tableDescription.jobDescription) {
      await queryInterface.changeColumn('jobs', 'jobDescription', {
        type: Sequelize.STRING(255),
        allowNull: true
      });
    }
    
    if (tableDescription.responsibilities) {
      await queryInterface.changeColumn('jobs', 'responsibilities', {
        type: Sequelize.STRING(255),
        allowNull: true
      });
    }
    
    if (tableDescription.smallDescription) {
      await queryInterface.changeColumn('jobs', 'smallDescription', {
        type: Sequelize.STRING(255),
        allowNull: true
      });
    }
    
    if (tableDescription.skills) {
      await queryInterface.changeColumn('jobs', 'skills', {
        type: Sequelize.STRING(255),
        allowNull: true
      });
    }
    
    if (tableDescription.tags) {
      await queryInterface.changeColumn('jobs', 'tags', {
        type: Sequelize.STRING(255),
        allowNull: true
      });
    }
    
    if (tableDescription.applyUrl) {
      await queryInterface.changeColumn('jobs', 'applyUrl', {
        type: Sequelize.STRING(255),
        allowNull: true
      });
    }
    
    if (tableDescription.companyLogo) {
      await queryInterface.changeColumn('jobs', 'companyLogo', {
        type: Sequelize.STRING(255),
        allowNull: true
      });
    }

    console.log('✅ Text fields reverted to VARCHAR(255)');
  }
}; 