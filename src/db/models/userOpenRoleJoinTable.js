const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/database");

class UserOpenRole extends Model {
  static associate(models) {
    UserOpenRole.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
    UserOpenRole.belongsTo(models.OpenRole, {
      foreignKey: "openRoleId",
      onDelete: "CASCADE",
    });
  }
}

UserOpenRole.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
      unique: "user_role_unique_constraint", // Add unique constraint
    },
    openRoleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "OpenRole",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      unique: "user_role_unique_constraint", // Add unique constraint
    },
    yearsOfExperience: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "UserOpenRole",
    tableName: "UserOpenRole",
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "openRoleId"],
      },
    ],
  }
);

module.exports = UserOpenRole;
