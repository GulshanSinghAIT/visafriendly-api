'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove unique index on (userId, loginDate) if it exists
    await queryInterface.removeIndex('UserLogin', 'user_login_date_unique').catch(() => {});
    // Remove userId column
    await queryInterface.removeColumn('UserLogin', 'userId').catch(() => {});
    // Add userEmail column
    await queryInterface.addColumn('UserLogin', 'userEmail', {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: 'User',
        key: 'email',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
    // Add unique index on (userEmail, loginDate)
    await queryInterface.addIndex('UserLogin', ['userEmail', 'loginDate'], {
      unique: true,
      name: 'user_login_date_unique',
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove unique index on (userEmail, loginDate)
    await queryInterface.removeIndex('UserLogin', 'user_login_date_unique').catch(() => {});
    // Remove userEmail column
    await queryInterface.removeColumn('UserLogin', 'userEmail').catch(() => {});
    // Add userId column back
    await queryInterface.addColumn('UserLogin', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
    // Add unique index on (userId, loginDate)
    await queryInterface.addIndex('UserLogin', ['userId', 'loginDate'], {
      unique: true,
      name: 'user_login_date_unique',
    });
  }
};
