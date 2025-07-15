

const User = require("../../db/models/user");
const job = require("../../db/models/job");
const { sequelize } = require("../../db/models/index");

const getAllRows = async (req, res) => {
  try {
    const { email } = req.query; // Get user email from request body

    if (!email) {
      return res.status(400).json({ success:false, message: "Email is required" });
    }

    const user = await User.findOne({
      where: { email },
    });

    const visibleColumns = await 
      sequelize.query('SELECT * from "dashboards"  where "userId" = ?', {
        replacements: [user.id],
        type: sequelize.QueryTypes.SELECT,
      });
    

    return res
      .status(200)
      .json({success:true, rows: visibleColumns});
  } catch (error) {
    console.error("Error getting dashboard rows:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {getAllRows};