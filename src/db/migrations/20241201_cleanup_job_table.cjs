'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // First, check current table structure
    const tableDescription = await queryInterface.describeTable('jobs');
    
    console.log('Current table structure:', Object.keys(tableDescription));
    
    // Add missing smallDescription column
    if (!tableDescription.smallDescription) {
      await queryInterface.addColumn('jobs', 'smallDescription', {
        type: Sequelize.TEXT,
        allowNull: true
      });
      console.log('Added smallDescription column');
    }
    
    // Handle duplicate columns - migrate data and remove old columns
    if (tableDescription.role && tableDescription.jobTitle) {
      // Copy data from role to jobTitle if jobTitle is empty
      await queryInterface.sequelize.query(`
        UPDATE jobs 
        SET "jobTitle" = role 
        WHERE "jobTitle" IS NULL OR "jobTitle" = ''
      `);
      
      // Remove the old role column
      await queryInterface.removeColumn('jobs', 'role');
      console.log('Removed duplicate role column, kept jobTitle');
    }
    
    if (tableDescription.yoe && tableDescription.yearsOfExperience) {
      // Copy data from yoe to yearsOfExperience if yearsOfExperience is empty
      await queryInterface.sequelize.query(`
        UPDATE jobs 
        SET "yearsOfExperience" = yoe 
        WHERE "yearsOfExperience" IS NULL
      `);
      
      // Remove the old yoe column
      await queryInterface.removeColumn('jobs', 'yoe');
      console.log('Removed duplicate yoe column, kept yearsOfExperience');
    }
    
    if (tableDescription.postedOn && tableDescription.jobPostingDate) {
      // Copy data from postedOn to jobPostingDate if jobPostingDate is empty
      await queryInterface.sequelize.query(`
        UPDATE jobs 
        SET "jobPostingDate" = "postedOn" 
        WHERE "jobPostingDate" IS NULL
      `);
      
      // Remove the old postedOn column
      await queryInterface.removeColumn('jobs', 'postedOn');
      console.log('Removed duplicate postedOn column, kept jobPostingDate');
    }
    
    // Update column constraints and types
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
    
    // Set default values for required columns
    await queryInterface.sequelize.query(`
      UPDATE jobs 
      SET "workSetting" = 'Onsite' 
      WHERE "workSetting" IS NULL
    `);
    
    await queryInterface.sequelize.query(`
      UPDATE jobs 
      SET "startupJob" = 'No' 
      WHERE "startupJob" IS NULL
    `);
    
    await queryInterface.sequelize.query(`
      UPDATE jobs 
      SET "visaSponsoring" = false 
      WHERE "visaSponsoring" IS NULL
    `);
    
    console.log('Migration completed successfully');
  },

  async down(queryInterface, Sequelize) {
    // This migration is mostly cleanup, so the down migration is minimal
    const tableDescription = await queryInterface.describeTable('jobs');
    
    // Remove smallDescription if it was added
    if (tableDescription.smallDescription) {
      await queryInterface.removeColumn('jobs', 'smallDescription');
    }
    
    console.log('Rollback completed');
  }
}; 