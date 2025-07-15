const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/database");

class H1bSponsorCase extends Model {}
H1bSponsorCase.init(
  {
    caseId: {
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
    EmployerName: {
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
     startDate: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    caseStatus: {
      type: DataTypes.INTEGER,
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
    modelName: "H1bSponsorCase",
    tableName: "H1bSponsorCases",
  }
);

module.exports = H1bSponsorCase;