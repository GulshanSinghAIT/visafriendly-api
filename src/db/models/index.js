"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../../config/config.js")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file));
    db[model.name] = model;
  });

// Call associate method on each model
Object.values(db).forEach((model) => {
  if (model.associate) {
    model.associate(db);
  }
});

// db.User.hasOne(db.Address, { foreignKey: "userId", onDelete: "CASCADE" });
// db.Address.belongsTo(db.User, { foreignKey: "userId" });

// db.User.belongsToMany(db.Education, {
//   through: "UserEducation",
//   foreignKey: "userId",
// });
// db.Education.belongsToMany(db.User, {
//   through: "UserEducation",
//   foreignKey: "educationId",
// });

// db.User.belongsToMany(db.JobType, {
//   through: "UserJobType",
//   foreignKey: "userId",
// });
// db.JobType.belongsToMany(db.User, {
//   through: "UserJobType",
//   foreignKey: "jobTypeId",
// });

// db.User.belongsToMany(db.OpenRole, {
//   through: "UserOpenRole",
//   foreignKey: "userId",
// });
// db.OpenRole.belongsToMany(db.User, {
//   through: "UserOpenRole",
//   foreignKey: "openRoleId",
// });

// db.User.belongsToMany(db.Skill, { through: "UserSkill", foreignKey: "userId" });
// db.Skill.belongsToMany(db.User, {
//   through: "UserSkill",
//   foreignKey: "skillId",
// });

// db.User.hasMany(db.SocialProfile, {
//   foreignKey: "userId",
//   onDelete: "CASCADE",
// });
// db.SocialProfile.belongsTo(db.User, { foreignKey: "userId" });

// db.User.belongsToMany(db.WorkSettingPreference, {
//   through: "UserWorkSetting",
//   foreignKey: "userId",
// });
// db.WorkSettingPreference.belongsToMany(db.User, {
//   through: "UserWorkSetting",
//   foreignKey: "workSettingId",
// });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
