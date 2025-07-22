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
      allowNull: false
    },
    searchDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    searchCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'DailySearch',
    tableName: 'daily_searches',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['email', 'searchDate']
      }
    ]
  });
  
  return DailySearch;
}; 