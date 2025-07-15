

const User = require("../../db/models/user");
const job = require("../../db/models/job");
const { sequelize } = require("../../db/models/index");

const getAllVisibleColumns = async (req, res) => {
  try {
    const { email } = req.query; // Get user email from request body

    if (!email) {
      return res.status(400).json({ succes:false, message: "Email is required" });
    }

    const user = await User.findOne({
      where: { email },
    });

    const visibleColumns = await 
      sequelize.query('SELECT * from "extraColumns"  where "userId" = ?', {
        replacements: [user.id],
        type: sequelize.QueryTypes.SELECT,
      });
    

    return res
      .status(200)
      .json({success:true, cols: visibleColumns});
  } catch (error) {
    console.error("Error getting visible columns:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {getAllVisibleColumns};