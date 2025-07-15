// migrations/XXXXXX-create-notification-tables.js
"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create ENUM type
    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_notification_type') THEN
          CREATE TYPE "enum_notification_type" AS ENUM ('jobs', 'profile', 'newsletter', 'announcements');
        END IF;
      END $$;
    `);

    // Create Notification table
    await queryInterface.createTable("Notification", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      type: {
        type: Sequelize.ENUM("jobs", "profile", "newsletter", "announcements"),
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    });

    // Create UserNotification table
    await queryInterface.createTable("UserNotification", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      notificationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Notification",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      enabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    });

    // Add indexes
    await queryInterface.addIndex(
      "UserNotification",
      ["email", "notificationId"],
      {
        unique: true,
        name: "unique_user_notification",
      }
    );

    // Add default notifications
    await queryInterface.bulkInsert("Notification", [
      {
        type: "jobs",
        title: "Job alerts and reminders",
        description:
          "Job updates and reminders for your saved and matched opportunities.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "jobs",
        title: "Job recommendations",
        description:
          "Job updates and reminders for your saved and matched opportunities.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "newsletter",
        title: "VisaFriendly Newsletter",
        description:
          "Job updates and reminders for your saved and matched opportunities.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "announcements",
        title: "Product Announcements",
        description:
          "Job updates and reminders for your saved and matched opportunities.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("UserNotification");
    await queryInterface.dropTable("Notification");
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "enum_notification_type";`
    );
  },
};
