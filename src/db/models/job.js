'use strict';
const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/database");

class job extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      job.belongsToMany(models.User, {
        through: "SavedJobs",
        foreignKey: "savedJobId",
        onDelete: "CASCADE",
      });
      job.belongsToMany(models.User, {
        through: "AppliedJobs",
        foreignKey: "appliedJobId",
        onDelete: "CASCADE",
      });
    }
  }
job.init(
  {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  jobTitle: {
    type: DataTypes.STRING,
    allowNull: false
  },
  yearsOfExperience: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  minExperience: {
    type: DataTypes.STRING,
    allowNull: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  jobType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  workSetting: {
    type: DataTypes.STRING,
    allowNull: false
  },
  minSalary: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  maxSalary: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  startupJob: {
    type: DataTypes.ENUM('Yes', 'No'),
    allowNull: false,
    defaultValue: 'No'
  },
  jobPostingDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  visaSponsoring: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  sponsorType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  applyUrl: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  responsibilities: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  companyLogo: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  jobDescription: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  smallDescription: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  skills: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  tags: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
},
  {
    sequelize,
    modelName: 'job',
  }
);
  
module.exports = job;