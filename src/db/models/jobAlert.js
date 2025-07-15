const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/database");

class JobAlert extends Model {
  static associate(models) {
    JobAlert.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
  }
}

JobAlert.init(
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
      onDelete: "CASCADE",
    },
    frequency: {
      type: DataTypes.ENUM("daily", "weekly", "monthly"),
      allowNull: false,
      validate: {
        isIn: [["daily", "weekly", "monthly"]],
      },
    },
    keywords: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    similarJobs: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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
    modelName: "JobAlert",
    tableName: "JobAlert",
    paranoid: true,
    freezeTableName: true,
  }
);

module.exports = JobAlert;
