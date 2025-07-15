const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/database");

class Skill extends Model {
  static associate(models) {
    // Many-to-Many: User <-> Skill
    Skill.belongsToMany(models.User, {
      through: "UserSkill",
      foreignKey: "skillId",
      onDelete: "CASCADE",
    });
  }
}

Skill.init(
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
    experienceInYears: {
      type: DataTypes.STRING,
      allowNull: true,
      // validate: {
      //   notNull: { msg: "experienceInYears cannot be null" },
      //   isInt: { msg: "experienceInYears must be an integer" },
      // },
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
    modelName: "Skill",
  }
);

module.exports = Skill;
