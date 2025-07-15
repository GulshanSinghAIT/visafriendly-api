const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/database");

class SocialProfile extends Model {
  static associate(models) {
    // One-to-Many: User -> SocialProfile
    SocialProfile.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
  }
}

SocialProfile.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
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
    websiteName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "websiteName cannot be null" },
        notEmpty: { msg: "websiteName cannot be empty" },
      },
    },
    link: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "link cannot be null" },
        notEmpty: { msg: "link cannot be empty" },
        isUrl: { msg: "Invalid URL format" },
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
    modelName: "SocialProfile",
  }
);

module.exports = SocialProfile;
