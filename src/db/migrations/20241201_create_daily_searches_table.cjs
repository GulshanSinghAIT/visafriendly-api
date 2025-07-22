'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('daily_searches', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      searchDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      searchCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
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

    // Add unique index for email + searchDate combination
    await queryInterface.addIndex('daily_searches', ['email', 'searchDate'], {
      unique: true,
      name: 'daily_searches_email_date_unique'
    });

    console.log('✅ Daily searches table created successfully');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('daily_searches');
    console.log('✅ Daily searches table dropped');
  }
}; 