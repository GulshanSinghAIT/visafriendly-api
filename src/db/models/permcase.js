const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/database");

class PermReport extends Model {}
PermReport.init(
  {
    Id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    year: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    Employer: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
    jobTitle: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    experienceLevel: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    baseSalary: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
     submitDate: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    decisionDate: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    caseStatus: {
      type: DataTypes.STRING,
      allowNull: true,
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
  },
  {
    sequelize,
    modelName: "PermReport",
    tableName: "PermReports",
  }
);

module.exports = PermReport;