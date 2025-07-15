

const User = require("../../db/models/user");
const pointsTable = require("../../db/models/pointstable");
const { sequelize } = require("../../db/models/index");

const deleteColumn = async (req, res) => {
    const t = await sequelize.transaction();

  try {
    const { id } = req.params; // Get ID from URL params
    const { email,colname } = req.body; 
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    
    const user = await User.findOne({
      where: { email },
    });
    // jsonb_set( "rowData"::jsonb, ?, ?)::json

    const savedJob = await 
      sequelize.query('DELETE FROM "extraColumns"  WHERE "userId"=? and "id" = ?' , {
        replacements: [user.id,id],
        type: sequelize.QueryTypes.DELETE,
        transaction: t ,
      });

      const deleteFromRows = await 
      sequelize.query('UPDATE "dashboards" SET "rowData" = "rowData" - ? WHERE "userId"=? ' , {
        replacements: [colname, user.id],
        type: sequelize.QueryTypes.DELETE,
        transaction: t ,
      });
    
      await t.commit();

    return res
      .status(200)
      .json(savedJob);
  } catch (error) {
    console.error("Error deleting column:", error);
    await t.rollback();
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {deleteColumn};