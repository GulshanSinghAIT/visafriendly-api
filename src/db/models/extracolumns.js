'use strict';
const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/database");

  class extraColumns extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      extraColumns.belongsTo(models.User);
    }
  }
  extraColumns.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "User",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
    },
    columnName: {
      allowNull: false,
      type: DataTypes.STRING
    },
    columnType: {
      allowNull: false,
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'extraColumns',
  });

  module.exports = extraColumns;