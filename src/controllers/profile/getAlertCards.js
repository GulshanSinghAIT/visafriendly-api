const User = require("../../db/models/user");
const JobAlert = require("../../db/models/jobAlert");

// Controller to get job alerts for a specific user by email
const getUserJobAlerts = async (req, res) => {
  try {
    const { email } = req.body; // Extract email from request body

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    // Find job alerts associated with the user by email
    const jobAlerts = await JobAlert.findAll({
      include: {
        model: User,
        where: { email },
        attributes: [], // Exclude user details, only need job alert info
      },
    });

    return res.status(200).json({ success: true, jobAlerts });
  } catch (error) {
    console.error("Error fetching job alerts:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = getUserJobAlerts;
