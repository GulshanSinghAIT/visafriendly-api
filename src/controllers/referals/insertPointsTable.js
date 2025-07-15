

const User = require("../../db/models/user");
const pointsTable = require("../../db/models/pointstable");
const { sequelize } = require("../../db/models/index");

const insertPointsTable = async (req, res) => {
  try {
    // const { id } = req.params; // Get ID from URL params
    const { email } = req.body; // Get user email from request body
    console.log(email)
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    
    const user = await User.findOne({
      where: { email },
    });

    const savedJob = await 
      sequelize.query('INSERT INTO "pointsTables"  ("referals_accepted","total_points","userId","createdAt","updatedAt") values (0,0,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)', {
        replacements: [user.id],
        type: sequelize.QueryTypes.INSERT,
      });
    

    return res
      .status(200)
      .json(savedJob);
  } catch (error) {
    console.error("Error inserting applied job:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {insertPointsTable};