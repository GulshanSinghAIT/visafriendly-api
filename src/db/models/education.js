'use strict';
const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/database");

class Education extends Model {
  static associate(models) {
    // define associations here
    Education.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  }
}

Education.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'User',
      key: 'id'
    }
  },
  school: {
    type: DataTypes.STRING,
    allowNull: false
  },
  major: {
    type: DataTypes.STRING,
    allowNull: false
  },
  degree: {
    type: DataTypes.STRING,
    allowNull: false
  },
  gpa: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  startMonth: {
    type: DataTypes.STRING,
    allowNull: false
  },
  startYear: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  endMonth: {
    type: DataTypes.STRING,
    allowNull: false
  },
  endYear: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Education',
  tableName: 'educations',
  timestamps: true
});

module.exports = Education;
