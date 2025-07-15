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
    type: DataTypes.STRING
  },
  role: {
    type: DataTypes.STRING
  },
  yoe: {
    type: DataTypes.INTEGER
  },
  location: {
    type: DataTypes.STRING
  },
  jobType: {
    type: DataTypes.STRING
  },
  salary: {
    type: DataTypes.STRING
  },
  postedOn: {
    type: DataTypes.DATE
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