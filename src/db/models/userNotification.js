// models/UserNotification.js
const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/database");

class UserNotification extends Model {
  static associate(models) {
    UserNotification.belongsTo(models.Notification, {
      foreignKey: "notificationId",
      as: "notification",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }
}

UserNotification.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    notificationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
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
    modelName: "UserNotification",
    indexes: [
      {
        unique: true,
        fields: ["email", "notificationId"],
      },
    ],
  }
);

module.exports = UserNotification;
