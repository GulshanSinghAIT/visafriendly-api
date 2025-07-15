// Notification.js
const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/database");

class Notification extends Model {
  static associate(models) {
    Notification.hasMany(models.UserNotification, {
      foreignKey: "notificationId",
      as: "userNotifications",
    });
  }
}

Notification.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    type: {
      type: DataTypes.ENUM("jobs", "profile", "newsletter", "announcements"),
      allowNull: false,
      validate: {
        notNull: { msg: "Notification type cannot be null" },
        isIn: {
          args: [["jobs", "profile", "newsletter", "announcements"]],
          msg: "Invalid notification type",
        },
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Title cannot be null" },
        notEmpty: { msg: "Title cannot be empty" },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: { msg: "Description cannot be null" },
        notEmpty: { msg: "Description cannot be empty" },
      },
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    paranoid: true,
    freezeTableName: true,
    modelName: "Notification",
    indexes: [
      {
        unique: true,
        fields: ["type", "title"],
      },
    ],
  }
);

module.exports = Notification;
