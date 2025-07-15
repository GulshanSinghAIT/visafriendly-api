

const User = require("../../db/models/user");
const job = require("../../db/models/job");
const { sequelize } = require("../../db/models/index");

const getAllTransactions = async (req, res) => {
  try {
    const { email } = req.query; // Get user email from request body

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({
      where: { email },
    });

    const appliedJobs = await 
      sequelize.query('SELECT * from "transactions"  where "userId" = ?', {
        replacements: [user.id],
        type: sequelize.QueryTypes.SELECT,
      });
    

    return res
      .status(200)
      .json({success:true, transactionDetails:appliedJobs});
  } catch (error) {
    console.error("Error getting transactions:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {getAllTransactions};