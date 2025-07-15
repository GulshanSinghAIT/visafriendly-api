

const User = require("../../db/models/user");
const job = require("../../db/models/job");
const { sequelize } = require("../../db/models/index");

const deleteSavedJob = async (req, res) => {

  try {
    
    const { id } = req.params; // Get alert ID from URL params
    const { email } = req.query; // Get user email from request body

    if (!email) {
      return res.status(400).json({ success:false, message: "Email is required" });
    }


    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
        return res.status(404).json({ success:false,message: "User not found" });
      }

      console.log(user.id,id)
      const delJob = await 
      sequelize.query('DELETE FROM "SavedJobs" WHERE "userId" = ? AND "savedJobId" = ?', {
        replacements: [user.id,id],
        type: sequelize.QueryTypes.DELETE,
      });

    return res
      .status(200)
      .json({success:true, message: "SuccessFully removed form saved jobs"});
  } catch (error) {
    console.error("Error deleting saved job:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {deleteSavedJob};