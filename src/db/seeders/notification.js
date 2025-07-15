"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Notification",
      [
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
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Notification", null, {});
  },
};
