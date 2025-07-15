

const User = require("../../db/models/user");
const job = require("../../db/models/job");
const { sequelize } = require("../../db/models/index");

const insertextraColumn = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    // const { id } = req.params; // Get ID from URL params
    const {email,fieldName,selectedProperty} = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({
      where: { email },
    });

    const savedJob = await 
      sequelize.query('INSERT INTO "extraColumns"  ("userId","columnName","columnType","status","createdAt","updatedAt") values (?,?,?,1,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)', {
        replacements: [user.id,fieldName,selectedProperty],
        type: sequelize.QueryTypes.INSERT,
        transaction: t ,
      });

      const updateDashboard = await 
      sequelize.query('UPDATE "dashboards" set "rowData"[?] =to_jsonb(? :: text)  WHERE "userId"=? ', {
        replacements: [fieldName,"",user.id],
        type: sequelize.QueryTypes.UPDATE,
        transaction: t ,

      });

    
      await t.commit();

    return res
      .status(200)
      .json({success:true});
  } catch (error) {

    console.error("Error inserting column job:", error);
    await t.rollback();

    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {insertextraColumn};