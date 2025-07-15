const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/database");

class UserLogin extends Model {
  static associate(models) {
    UserLogin.belongsTo(models.User, {
      foreignKey: {
        name: "userEmail",
        allowNull: false,
      },
      targetKey: "email",
      onDelete: "CASCADE",
    });
  }
}

UserLogin.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    userEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "User",
        key: "email",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    loginDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notNull: { msg: "loginDate cannot be null" },
        notEmpty: { msg: "loginDate cannot be empty" },
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
    modelName: "UserLogin",
    indexes: [
      {
        unique: true,
        fields: ["userEmail", "loginDate"],
        name: "user_login_date_unique",
      },
    ],
  }
);

module.exports = UserLogin; 