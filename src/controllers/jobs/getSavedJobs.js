const User = require("../../db/models/user");
const job = require("../../db/models/job");
const { sequelize } = require("../../db/models/index");

const getAllSaved = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    console.log("Fetching saved jobs for email:", email);

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      console.log("User not found for email:", email);
      return res.status(404).json({ success: false, message: "User not found" });
    }

    console.log("Found user with ID:", user.id);

    // Get saved jobs with full job details
    const savedJobs = await sequelize.query(
      `SELECT j.* FROM "Jobs" j 
       INNER JOIN "SavedJobs" s ON j.id = s."savedJobId" 
       WHERE s."userId" = :userId`,
      {
        replacements: { userId: user.id },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    console.log("Found saved jobs:", savedJobs.length);

    return res.status(200).json({
      success: true,
      savedJobs: savedJobs
    });
  } catch (error) {
    console.error("Error getting saved jobs:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal Server Error",
      error: error.message 
    });
  }
};

module.exports = {getAllSaved};