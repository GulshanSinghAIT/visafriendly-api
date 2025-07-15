const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/database");

class Address extends Model {
  static associate(models) {
    Address.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
  }
}

Address.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "State cannot be null" },
        notEmpty: { msg: "State cannot be empty" },
      },
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "City cannot be null" },
        notEmpty: { msg: "City cannot be empty" },
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "User",
        key: "id",
      },
      onDelete: "CASCADE",
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
    modelName: "Address",
    tableName: "Address",
    paranoid: true,
    freezeTableName: true,
  }
);

module.exports = Address;
