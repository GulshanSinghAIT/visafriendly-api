

  const User = require("../../db/models/user");
const job = require("../../db/models/job");
const { sequelize } = require("../../db/models/index");

const insertSavedJob = async (req, res) => {
  try {
    const { id } = req.params; // Get alert ID from URL params
    const { email } = req.body; // Get user email from request body
    console.log(email);
    console.log(id);

    if (!email) {
      return res.status(400).json({success:false, message: "Email is required" });
    }

    const user = await User.findOne({
      where: { email },
    });
    // Find the job alert and ensure it belongs to the user
    const savedJob = await 
      sequelize.query('INSERT INTO "SavedJobs"  ("userId","savedJobId","createdAt","updatedAt") values (?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)', {
        replacements: [user.id,id],
        type: sequelize.QueryTypes.INSERT,
      });
    

    return res
      .status(200)
      .json({success: true});
  } catch (error) {
    console.error("Error inserting saved job:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {insertSavedJob};