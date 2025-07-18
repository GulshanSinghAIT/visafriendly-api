import { createRequire } from "module";
const require = createRequire(import.meta.url);

const User = require("../../db/models/user");
const JobAlert = require("../../db/models/jobAlert");

// Delete a specific job alert by ID
const deleteJobAlert = async (req, res) => {
  try {
    const { id } = req.params; // Get alert ID from URL params
    const { email } = req.body; // Get user email from request body

    // Find the job alert and ensure it belongs to the user
    const jobAlert = await JobAlert.findOne({
      where: { id },
      include: {
        model: User,
        where: { email },
        attributes: [],
      },
    });

    if (!jobAlert) {
      return res
        .status(404)
        .json({ success: false, message: "Job alert not found" });
    }

    await jobAlert.destroy({ force: true }); // Delete the job alert

    return res
      .status(200)
      .json({ success: true, message: "Job alert deleted successfully" });
  } catch (error) {
    console.error("Error deleting job alert:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Delete all job alerts for a user
const deleteAllJobAlerts = async (req, res) => {
  try {
    const { email } = req.body; // Get user email from request body

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    await JobAlert.destroy({ where: { userId: user.id }, force: true });

    return res
      .status(200)
      .json({ success: true, message: "All job alerts deleted successfully" });
  } catch (error) {
    console.error("Error deleting all job alerts:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export { deleteJobAlert, deleteAllJobAlerts };
