'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // First, check if columns exist and handle them properly
    const tableDescription = await queryInterface.describeTable('jobs');
    
    // Add new columns only if they don't exist
    if (!tableDescription.minExperience) {
      await queryInterface.addColumn('jobs', 'minExperience', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }

    if (!tableDescription.workSetting) {
      await queryInterface.addColumn('jobs', 'workSetting', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Onsite'
      });
    }

    if (!tableDescription.minSalary) {
      await queryInterface.addColumn('jobs', 'minSalary', {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      });
    }

    if (!tableDescription.maxSalary) {
      await queryInterface.addColumn('jobs', 'maxSalary', {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      });
    }

    if (!tableDescription.startupJob) {
      await queryInterface.addColumn('jobs', 'startupJob', {
        type: Sequelize.ENUM('Yes', 'No'),
        allowNull: false,
        defaultValue: 'No'
      });
    }

    if (!tableDescription.visaSponsoring) {
      await queryInterface.addColumn('jobs', 'visaSponsoring', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      });
    }

    if (!tableDescription.sponsorType) {
      await queryInterface.addColumn('jobs', 'sponsorType', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }

    if (!tableDescription.applyUrl) {
      await queryInterface.addColumn('jobs', 'applyUrl', {
        type: Sequelize.TEXT,
        allowNull: true
      });
    }

    if (!tableDescription.responsibilities) {
      await queryInterface.addColumn('jobs', 'responsibilities', {
        type: Sequelize.TEXT,
        allowNull: true
      });
    }

    if (!tableDescription.companyLogo) {
      await queryInterface.addColumn('jobs', 'companyLogo', {
        type: Sequelize.TEXT,
        allowNull: true
      });
    }

    if (!tableDescription.jobDescription) {
      await queryInterface.addColumn('jobs', 'jobDescription', {
        type: Sequelize.TEXT,
        allowNull: true
      });
    }

    if (!tableDescription.smallDescription) {
      await queryInterface.addColumn('jobs', 'smallDescription', {
        type: Sequelize.TEXT,
        allowNull: true
      });
    }

    if (!tableDescription.skills) {
      await queryInterface.addColumn('jobs', 'skills', {
        type: Sequelize.TEXT,
        allowNull: true
      });
    }

    if (!tableDescription.tags) {
      await queryInterface.addColumn('jobs', 'tags', {
        type: Sequelize.TEXT,
        allowNull: true
      });
    }

    // Handle column renames only if the old columns exist and new ones don't
    if (tableDescription.role && !tableDescription.jobTitle) {
      await queryInterface.renameColumn('jobs', 'role', 'jobTitle');
    }

    if (tableDescription.yoe && !tableDescription.yearsOfExperience) {
      await queryInterface.renameColumn('jobs', 'yoe', 'yearsOfExperience');
    }

    if (tableDescription.postedOn && !tableDescription.jobPostingDate) {
      await queryInterface.renameColumn('jobs', 'postedOn', 'jobPostingDate');
    }

    // Update existing columns if they exist but need modifications
    if (tableDescription.jobTitle) {
      await queryInterface.changeColumn('jobs', 'jobTitle', {
        type: Sequelize.STRING,
        allowNull: false
      });
    }

    if (tableDescription.yearsOfExperience) {
      await queryInterface.changeColumn('jobs', 'yearsOfExperience', {
        type: Sequelize.INTEGER,
        allowNull: true
      });
    }

    if (tableDescription.jobPostingDate) {
      await queryInterface.changeColumn('jobs', 'jobPostingDate', {
        type: Sequelize.DATE,
        allowNull: false
      });
    }
  },

  async down(queryInterface, Sequelize) {
    // Remove added columns
    const tableDescription = await queryInterface.describeTable('jobs');
    
    if (tableDescription.minExperience) {
      await queryInterface.removeColumn('jobs', 'minExperience');
    }
    
    if (tableDescription.workSetting) {
      await queryInterface.removeColumn('jobs', 'workSetting');
    }
    
    if (tableDescription.minSalary) {
      await queryInterface.removeColumn('jobs', 'minSalary');
    }
    
    if (tableDescription.maxSalary) {
      await queryInterface.removeColumn('jobs', 'maxSalary');
    }
    
    if (tableDescription.startupJob) {
      await queryInterface.removeColumn('jobs', 'startupJob');
    }
    
    if (tableDescription.visaSponsoring) {
      await queryInterface.removeColumn('jobs', 'visaSponsoring');
    }
    
    if (tableDescription.sponsorType) {
      await queryInterface.removeColumn('jobs', 'sponsorType');
    }
    
    if (tableDescription.applyUrl) {
      await queryInterface.removeColumn('jobs', 'applyUrl');
    }
    
    if (tableDescription.responsibilities) {
      await queryInterface.removeColumn('jobs', 'responsibilities');
    }
    
    if (tableDescription.companyLogo) {
      await queryInterface.removeColumn('jobs', 'companyLogo');
    }
    
    if (tableDescription.jobDescription) {
      await queryInterface.removeColumn('jobs', 'jobDescription');
    }
    
    if (tableDescription.smallDescription) {
      await queryInterface.removeColumn('jobs', 'smallDescription');
    }
    
    if (tableDescription.skills) {
      await queryInterface.removeColumn('jobs', 'skills');
    }
    
    if (tableDescription.tags) {
      await queryInterface.removeColumn('jobs', 'tags');
    }

    // Revert column renames if they were done
    if (tableDescription.jobTitle && !tableDescription.role) {
      await queryInterface.renameColumn('jobs', 'jobTitle', 'role');
    }
    
    if (tableDescription.yearsOfExperience && !tableDescription.yoe) {
      await queryInterface.renameColumn('jobs', 'yearsOfExperience', 'yoe');
    }
    
    if (tableDescription.jobPostingDate && !tableDescription.postedOn) {
      await queryInterface.renameColumn('jobs', 'jobPostingDate', 'postedOn');
    }
  }
}; 