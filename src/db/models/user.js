const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/database");

class User extends Model {
  static associate(models) {
    User.belongsTo(models.CurrentPlans, {
      foreignKey: {
        name: "currentPlanId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
    });
    User.hasMany(models.PastPayments, {
      foreignKey: {
        name: "userId",
        allowNull: false,
      },
      onDelete: "CASCADE",
    });
    User.belongsToMany(models.Notification, {
      through: models.UserNotification,
      foreignKey: "userId",
    });
    User.hasOne(models.Address, {
      foreignKey: "userId",
      onDelete: "CASCADE",
      as: "address",
    });
    User.hasOne(models.pointsTable, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });

    User.belongsToMany(models.Education, {
      through: "UserEducation",
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
    User.belongsToMany(models.JobType, {
      through: "UserJobType",
      foreignKey: "userId",
      onDelete: "CASCADE",
      as: "jobTypes",
    });
    User.belongsToMany(models.OpenRole, {
      through: "UserOpenRole",
      foreignKey: "userId",
      otherKey: "openRoleId",
      onDelete: "CASCADE",
      as: "openRoles",
    });
    User.belongsToMany(models.Skill, {
      through: "UserSkill",
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
    User.hasMany(models.SocialProfile, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
    User.hasMany(models.transactions);
    User.hasMany(models.extraColumns);
    User.hasMany(models.dashboard);

    User.belongsToMany(models.WorkSettingPreference, {
      through: "UserWorkSetting",
      foreignKey: "userId",
      onDelete: "CASCADE",
      as: "workSettings",
    });
    User.belongsToMany(models.WorkExperience, {
      through: "UserWorkExperience",
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
    User.belongsToMany(models.job, {
      through: "SavedJobs",
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
    User.belongsToMany(models.job, {
      through: "AppliedJobs",
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
    User.hasMany(models.UserLogin, {
      foreignKey: "userEmail",
      sourceKey: "email",
      onDelete: "CASCADE",
    });
  }
}

User.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    currentPlanId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "CurrentPlans",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
      defaultValue: 1,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: { msg: "email cannot be null" },
        notEmpty: { msg: "email cannot be empty" },
        isEmail: { msg: "Invalid email format" },
      },
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "passwordHash cannot be null" },
        notEmpty: { msg: "passwordHash cannot be empty" },
      },
    },
    firstName: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: "firstName cannot be empty" },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: "lastName cannot be empty" },
      },
    },
    mobileNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: { msg: "mobileNumber cannot be null" },
        notEmpty: { msg: "mobileNumber cannot be empty" },
        isNumeric: { msg: "mobileNumber must contain only numbers" },
        len: {
          args: [10, 15],
          msg: "mobileNumber must be between 10 to 15 digits",
        },
      },
    },
    role: {
      type: DataTypes.STRING,
    },
    yearsOfExperience: {
      type: DataTypes.STRING,
    },
    referralSource: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Referral source cannot be null" },
        notEmpty: { msg: "Referral source cannot be empty" },
      },
    },
    Summary: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    expectedSalary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Expected annual salary in USD',
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
    modelName: "User",
  }
);

module.exports = User;
