const User = require("../../db/models/user");
const job = require("../../db/models/job");
const { sequelize } = require("../../db/models/index");

const getTop5 = async (req, res) => {
  try {
    
    const top5Members = await 
      sequelize.query('SELECT "firstName","lastName","total_points" from "pointsTables" INNER JOIN "User"  on "pointsTables"."userId" = "User"."id" ORDER BY  "total_points" DESC limit 5', {
        type: sequelize.QueryTypes.SELECT,
      });
    

    return res
      .status(200)
      .json(top5Members);
  } catch (error) {
    console.error("Error getting top 5 members:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {getTop5};