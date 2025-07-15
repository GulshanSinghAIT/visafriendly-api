const JobAlert = require("../../db/models/jobAlert");

const updateJobAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, keywords, location, frequency } = req.body;

    // Ensure required fields are provided
    if (!email || !keywords || !location || !frequency) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Find the job alert by ID
    const jobAlert = await JobAlert.findByPk(id);
    if (!jobAlert) {
      return res
        .status(404)
        .json({ success: false, message: "Job alert not found" });
    }

    // Update the job alert
    await jobAlert.update({
      keywords: keywords.join(","), // Convert array to comma-separated string
      frequency: frequency.toLowerCase(),
    });

    return res.status(200).json({
      success: true,
      message: "Job alert updated successfully",
      data: jobAlert,
    });
  } catch (error) {
    console.error("Error updating job alert:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

module.exports = { updateJobAlert };
