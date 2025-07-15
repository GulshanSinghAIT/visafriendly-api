

const User = require("../../db/models/user");
const pointsTable = require("../../db/models/pointstable");
const { sequelize } = require("../../db/models/index");

const updateTableCell = async (req, res) => {
  try {
    const { id } = req.params; // Get ID from URL params
    const { email } = req.body; // Get user email from request body
    const {columnName} = req.body;
    const {value} = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    
    const user = await User.findOne({
      where: { email },
    });
    // jsonb_set( "rowData"::jsonb, ?, ?)::json

    const savedJob = await 
      sequelize.query('UPDATE "dashboards" set "rowData"[?] =to_jsonb(? :: text)  WHERE "id"=? ', {
        replacements: [columnName,value,id],
        type: sequelize.QueryTypes.UPDATE,
      });
    

    return res
      .status(200)
      .json({success:true});
  } catch (error) {
    console.error("Error updating refs and points:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {updateTableCell};