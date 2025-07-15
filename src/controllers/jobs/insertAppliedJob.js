

  const User = require("../../db/models/user");
const job = require("../../db/models/job");
const { sequelize } = require("../../db/models/index");

const insertAppliedJob = async (req, res) => {
  try {
    const { id } = req.params; // Get ID from URL params
    const { email } = req.body; // Get user email from request body

    if (!email) {
      return res.status(400).json({ success:false, message: "Email is required" });
    }

    const user = await User.findOne({
      where: { email },
    });

    const savedJob = await 
      sequelize.query('INSERT INTO "AppliedJobs"  ("userId","appliedJobId","createdAt","updatedAt") values (?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)', {
        replacements: [user.id,id],
        type: sequelize.QueryTypes.INSERT,
      });
    

    return res
      .status(200)
      .json({success:true});
  } catch (error) {
    console.error("Error inserting applied job:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {insertAppliedJob};