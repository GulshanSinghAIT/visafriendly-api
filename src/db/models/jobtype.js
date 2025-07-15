const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/database");

class JobType extends Model {
  static associate(models) {
    // Many-to-Many: User <-> JobType
    JobType.belongsToMany(models.User, {
      through: "UserJobType",
      foreignKey: "jobTypeId",
      onDelete: "CASCADE",
      as: "users",
    });
  }
}

JobType.init(
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
    modelName: "JobType",
  }
);

module.exports = JobType;
