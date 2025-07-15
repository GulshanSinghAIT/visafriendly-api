

const User = require("../../db/models/user");
const pointsTable = require("../../db/models/pointstable");
const { sequelize } = require("../../db/models/index");

const updateColumnVisibility = async (req, res) => {
  try {
    const {email, visColumnArray} = req.body;
    console.log(email);
    console.log(visColumnArray);
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    
    const user = await User.findOne({
      where: { email },
    });

    const savedJob = await 
      sequelize.query('UPDATE "extraColumns" SET  "status" = 1-"status" ,"updatedAt" = CURRENT_TIMESTAMP WHERE "userId"=? and "id" in (?)', {
        replacements: [user.id,visColumnArray],
        type: sequelize.QueryTypes.INSERT,
      });
    

    return res
      .status(200)
      .json(savedJob);
  } catch (error) {
    console.error("Error updating column visibility:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};


module.exports = {updateColumnVisibility};