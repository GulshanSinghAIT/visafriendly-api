const User = require("../../db/models/user");
const JobAlert = require("../../db/models/jobAlert");

// Create a new job alert
const jobAlertController = async (req, res) => {
  try {
    const { email, frequency, keywords, similarJobs } = req.body;

    if (!frequency || !keywords || !Array.isArray(keywords)) {
      return res.status(400).json({ message: "Invalid request data." });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const jobAlert = await JobAlert.create({
      userId: user.id,
      frequency,
      keywords: keywords.join(","),
      similarJobs: similarJobs || false,
    });

    // await user.addJobAlert(jobAlert);

    return res
      .status(201)
      .json({ message: "Job alert created successfully.", jobAlert });
  } catch (error) {
    console.error("Error creating job alert:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { jobAlertController };
