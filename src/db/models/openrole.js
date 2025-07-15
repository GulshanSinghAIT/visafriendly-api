const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/database");

class OpenRole extends Model {
  static associate(models) {
    // Many-to-Many: User <-> OpenRole (with additional attribute: yearsOfExperience)
    OpenRole.belongsToMany(models.User, {
      through: models.UserOpenRole,
      foreignKey: "openRoleId",
      otherKey: "userId",
      onDelete: "CASCADE",
      as: "users",
    });
  }
}

OpenRole.init(
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
    modelName: "OpenRole",
  }
);

module.exports = OpenRole;
