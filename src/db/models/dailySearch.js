'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DailySearch extends Model {
    static associate(models) {
      // define associations here if needed
    }
  }
  
  DailySearch.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false // Multiple records per email (one per day)
    },
    searchDate: {
      type: DataTypes.DATEONLY, // Store only the date part
      allowNull: false
    },
    searchCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'DailySearch',
    tableName: 'daily_searches',
    indexes: [
      {
        unique: true,
        fields: ['email', 'searchDate'] // Ensure one record per user per day
      }
    ]
  });
  
  return DailySearch;
}; 