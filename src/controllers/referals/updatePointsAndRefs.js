

const User = require("../../db/models/user");
const pointsTable = require("../../db/models/pointstable");
const { sequelize } = require("../../db/models/index");

const updatePointsAndRefs = async (req, res) => {
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
      sequelize.query('UPDATE "pointsTables" SET  "referals_accepted" = "referals_accepted"+1, "total_points" = "total_points"+200,"updatedAt" = CURRENT_TIMESTAMP WHERE "userId"=?', {
        replacements: [user.id],
        type: sequelize.QueryTypes.INSERT,
      });
    

    return res
      .status(200)
      .json(savedJob);
  } catch (error) {
    console.error("Error updating refs and points:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const updatePoints = async (req, res) => {
    try {
      const { points } = req.params; // Get ID from URL params
      const { email } = req.body; // Get user email from request body
      console.log(points)
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      
      const user = await User.findOne({
        where: { email },
      });
  
      const savedJob = await 
        sequelize.query('UPDATE "pointsTables" SET   "total_points" = "total_points"+ ? ,"updatedAt" = CURRENT_TIMESTAMP WHERE "userId"=?', {
          replacements: [points,user.id],
          type: sequelize.QueryTypes.UPDATE,
        });
      
  
      return res
        .status(200)
        .json(savedJob);
    } catch (error) {
      console.error("Error updating points:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  };

module.exports = {updatePointsAndRefs,updatePoints};