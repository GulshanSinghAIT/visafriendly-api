'use strict';
const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/database");

class Links extends Model {
  static associate(models) {
    Links.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  }
}

Links.init({
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
  linkedin: {
    type: DataTypes.STRING,
    allowNull: true
  },
  github: {
    type: DataTypes.STRING,
    allowNull: true
  },
  portfolio: {
    type: DataTypes.STRING,
    allowNull: true
  },
  other: {
    type: DataTypes.STRING,
    allowNull: true
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'Links',
  tableName: 'links',
  timestamps: true
});

module.exports = Links; 