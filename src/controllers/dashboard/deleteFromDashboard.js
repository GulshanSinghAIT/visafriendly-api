

const User = require("../../db/models/user");
const pointsTable = require("../../db/models/pointstable");
const { sequelize } = require("../../db/models/index");

const deleteRows = async (req, res) => {
  console.log(req);
  try {
    const { email,delArray } = req.body;
    console.log(email)
    if (!email) {
      return res.status(400).json({ success:false, message: "Email is required" });
    }
    
    const user = await User.findOne({
      where: { email },
    });
    // jsonb_set( "rowData"::jsonb, ?, ?)::json

    const savedJob = await 
      sequelize.query('DELETE FROM "dashboards"  WHERE "userId"=? and "id" in (?)' , {
        replacements: [user.id,delArray],
        type: sequelize.QueryTypes.DELETE,
      });
    

    return res
      .status(200)
      .json({success:true});
  } catch (error) {
    console.error("Error deleting rows:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {deleteRows};