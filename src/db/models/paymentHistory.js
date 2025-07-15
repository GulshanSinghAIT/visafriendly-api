const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/database");

class PastPayments extends Model {
  static associate(models) {
    // One-to-Many: User -> PastPayment
    PastPayments.belongsTo(models.User, {
      foreignKey: {
        name: "userId",
        allowNull: false,
      },
      onDelete: "CASCADE",
    });
  }
}

PastPayments.init(
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
    paymentID: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Dodo Payments payment/subscription ID",
    },
    invoicePdfLink: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: { msg: "Must be a valid URL" },
      },
    },
    plan: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Plan cannot be null" },
        notEmpty: { msg: "Plan cannot be empty" },
      },
    },
    amount: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Amount cannot be null" },
        min: {
          args: [0],
          msg: "Amount must be a positive number",
        },
      },
    },
    status: {
      type: DataTypes.ENUM("PAID", "PENDING", "FAILED", "CANCELLED"),
      allowNull: false,
      defaultValue: "PENDING",
      validate: {
        notNull: { msg: "Status cannot be null" },
      },
    },
    billingDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: { msg: "Billing date cannot be null" },
        isDate: { msg: "Billing date must be a valid date" },
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
    modelName: "PastPayments",
  }
);

module.exports = PastPayments;
