const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/database");

class Resume extends Model {
  static associate(models) {
    Resume.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
  }

  static async setDefaultResume(resumeId, userId) {
    try {
      // Begin a transaction
      const transaction = await sequelize.transaction();

      try {
        // First, set isDefault to false for all user's resumes
        await this.update(
          { isDefault: false },
          {
            where: { userId },
            transaction,
          }
        );

        // Then set the specified resume as default
        await this.update(
          { isDefault: true },
          {
            where: { id: resumeId, userId },
            transaction,
          }
        );

        // Commit the transaction
        await transaction.commit();
        return true;
      } catch (error) {
        // Rollback the transaction in case of error
        await transaction.rollback();
        throw error;
      }
    } catch (error) {
      console.error("Error setting default resume:", error);
      throw error;
    }
  }
}

Resume.init(
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
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "fileName cannot be empty" },
      },
    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "filePath cannot be empty" },
      },
    },
    extractedText: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    skills: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    },
  },
  {
    sequelize,
    paranoid: true,
    freezeTableName: true,
    modelName: "Resume",
  }
);

module.exports = Resume;
