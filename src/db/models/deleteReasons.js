const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/database");

class DeleteReasons extends Model {
  static associate(models) {
    // This table stores reasons for deleted users, so we don't need active associations
    // The userId field references the User table, but since users are soft-deleted,
    // we maintain the reference for data integrity
  }
}

DeleteReasons.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "User",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      comment: "ID of the deleted user",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Email cannot be null" },
        notEmpty: { msg: "Email cannot be empty" },
        isEmail: { msg: "Invalid email format" },
      },
      comment: "Email of the deleted user for reference",
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: { msg: "Reason cannot be null" },
        notEmpty: { msg: "Reason cannot be empty" },
        len: {
          args: [1, 1000],
          msg: "Reason must be between 1 and 1000 characters",
        },
      },
      comment: "The reason provided by the user for account deletion",
    },
    category: {
      type: DataTypes.ENUM(
        "PRICING_ISSUES",
        "NOT_FINDING_JOBS",
        "FOUND_JOB_ELSEWHERE",
        "PRIVACY_CONCERNS",
        "POOR_USER_EXPERIENCE",
        "TECHNICAL_ISSUES",
        "NO_LONGER_NEEDED",
        "OTHER"
      ),
      allowNull: true,
      comment: "Categorized reason for easier analysis",
    },
    additionalFeedback: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 2000],
          msg: "Additional feedback must be less than 2000 characters",
        },
      },
      comment: "Additional feedback or comments from the user",
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "When the user account was deleted",
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    freezeTableName: true,
    modelName: "DeleteReasons",
    tableName: "DeleteReasons",
  }
);

module.exports = DeleteReasons; 