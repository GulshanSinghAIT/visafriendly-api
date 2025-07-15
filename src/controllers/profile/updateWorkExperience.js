const WorkExperience = require("../../db/models/workExperience");

const updateWorkExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      email,
      jobTitle,
      companyName,
      startDate,
      endDate,
      description,
      companyDomain,
      isCurrentJob,
    } = req.body;

    // Find the work experience entry
    const workExperience = await WorkExperience.findOne({ where: { id } });

    if (!workExperience) {
      return res
        .status(404)
        .json({ success: false, message: "Work experience not found" });
    }

    // Update the entry
    await workExperience.update({
      jobTitle,
      companyName,
      companyDomain,
      startDate,
      endDate: isCurrentJob ? null : endDate,
      currentWorkHere: isCurrentJob,
      description,
    });

    return res
      .status(200)
      .json({ success: true, message: "Work experience updated successfully" });
  } catch (error) {
    console.error("Error updating work experience:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

module.exports = { updateWorkExperience };
