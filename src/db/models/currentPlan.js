const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/database");

class CurrentPlans extends Model {
  static associate(models) {
    // Many-to-One: CurrentPlan -> User (Many users can have the same current plan)
    CurrentPlans.hasMany(models.User, {
      foreignKey: {
        name: "currentPlanId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
    });
  }
}

CurrentPlans.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    planName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: { msg: "Plan name cannot be null" },
        notEmpty: { msg: "Plan name cannot be empty" },
      },
    },
    planType: {
      type: DataTypes.ENUM("FREE", "MONTHLY", "QUARTERLY", "YEARLY"),
      allowNull: false,
    },
    price: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        min: 0,
      },
    },

    billingCycle: {
      type: DataTypes.INTEGER, // in months
      allowNull: false,
      defaultValue: 1,
    },

    basicDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    paranoid: true,
    freezeTableName: true,
    modelName: "CurrentPlans",
  }
);

module.exports = CurrentPlans;
