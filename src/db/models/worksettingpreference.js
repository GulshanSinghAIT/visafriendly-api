const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/database");

class WorkSettingPreference extends Model {
  static associate(models) {
    WorkSettingPreference.belongsToMany(models.User, {
      through: "UserWorkSetting",
      foreignKey: "workSettingId",
      onDelete: "CASCADE",
      as: "workSettingPreferences",
    });
  }
}

WorkSettingPreference.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: { msg: "name cannot be null" },
        notEmpty: { msg: "name cannot be empty" },
      },
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
    paranoid: true,
    freezeTableName: true,
    modelName: "WorkSettingPreference",
  }
);

module.exports = WorkSettingPreference;
