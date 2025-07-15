const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/database");

class WorkExperience extends Model {
  static associate(models) {
    WorkExperience.belongsToMany(models.User, {
      through: "UserWorkExperience",
      foreignKey: "workExperienceId",
      onDelete: "CASCADE",
    });
  }
}

WorkExperience.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Company name cannot be null" },
        notEmpty: { msg: "Company name cannot be empty" },
      },
    },
    companyDomain: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: { msg: "Company domain must be a valid URL" }
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Title cannot be null" },
        notEmpty: { msg: "Title cannot be empty" },
      },
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: { msg: "Start date cannot be null" },
        isDate: { msg: "Start date must be a valid date" },
      },
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: { msg: "End date must be a valid date" },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    currentWorkHere: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    modelName: "WorkExperience",
    tableName: "WorkExperience",
    paranoid: true,
    freezeTableName: true,
  }
);

module.exports = WorkExperience;
