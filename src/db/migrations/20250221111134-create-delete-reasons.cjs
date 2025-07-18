'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('DeleteReasons', {
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
          model: 'User',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Email of the deleted user for reference'
      },
      reason: {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: 'The reason provided by the user for account deletion'
      },
      category: {
        type: Sequelize.ENUM(
          'PRICING_ISSUES',
          'NOT_FINDING_JOBS',
          'FOUND_JOB_ELSEWHERE',
          'PRIVACY_CONCERNS',
          'POOR_USER_EXPERIENCE',
          'TECHNICAL_ISSUES',
          'NO_LONGER_NEEDED',
          'OTHER'
        ),
        allowNull: true,
        comment: 'Categorized reason for easier analysis'
      },
      additionalFeedback: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Additional feedback or comments from the user'
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: 'When the user account was deleted'
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

    // Add indexes for better query performance
    await queryInterface.addIndex('DeleteReasons', ['userId']);
    await queryInterface.addIndex('DeleteReasons', ['email']);
    await queryInterface.addIndex('DeleteReasons', ['category']);
    await queryInterface.addIndex('DeleteReasons', ['deletedAt']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('DeleteReasons');
  }
}; 