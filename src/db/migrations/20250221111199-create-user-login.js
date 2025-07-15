'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserLogin', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userEmail: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'User',
          key: 'email'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      loginDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    });

    // Add unique constraint to ensure only one login record per user per day
    await queryInterface.addIndex('UserLogin', ['userEmail', 'loginDate'], {
      unique: true,
      name: 'user_login_date_unique'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserLogin');
  }
}; 