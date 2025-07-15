

const User = require("../../db/models/user");
const job = require("../../db/models/job");
const { sequelize } = require("../../db/models/index");

const insertTransaction = async (req, res) => {
    const t = await sequelize.transaction();
  try {
    const { id } = req.params; // Get ID from URL params
    const data = req.body; // Get details from request body
    console.log(data);
    const email =data.email;
    console.log(email);
    const pointsAfter = data.pointsAfter;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({
      where: { email },
    });

    const savedJob = await 
      sequelize.query('INSERT INTO "transactions"  ("totalPointsAfter","pointsSpend","userId","transDate","createdAt","updatedAt") values (?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)', {
        replacements: [pointsAfter,id,user.id],
        type: sequelize.QueryTypes.INSERT,
        transaction: t ,
      });

      const savedPT = await 
        sequelize.query('UPDATE "pointsTables" SET   "total_points" = ? ,"updatedAt" = CURRENT_TIMESTAMP WHERE "userId"=?', {
          replacements: [pointsAfter,user.id],
          type: sequelize.QueryTypes.UPDATE,
          transaction: t,
        });

      await t.commit();
    return res
      .status(200)
      .json(savedJob);
  } catch (error) {
    console.error("Error inserting transaction:", error);
    await t.rollback();
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {insertTransaction};