const WorkExperience = require("../../db/models/workExperience");
const User = require("../../db/models/user");

// Get all work experiences for a user
const getUserWorkExperience = async (req, res) => {
  try {
    const { email } = req.body; // Email from request body

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const workExperiences = await WorkExperience.findAll({
      include: {
        model: User,
        where: { email },
        attributes: [], // Exclude user details
      },
    });

    return res.status(200).json({ success: true, workExperiences });
  } catch (error) {
    console.error("Error fetching work experiences:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Delete a work experience by ID
const deleteWorkExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body; // Email from request body

    if (!email || !id) {
      return res
        .status(400)
        .json({ success: false, message: "Email and ID are required" });
    }

    // Ensure the experience belongs to the user before deleting
    const experience = await WorkExperience.findOne({
      where: { id },
      include: { model: User, where: { email } },
    });

    if (!experience) {
      return res
        .status(404)
        .json({ success: false, message: "Work experience not found" });
    }

    await experience.destroy({ force: true });

    return res
      .status(200)
      .json({ success: true, message: "Work experience deleted successfully" });
  } catch (error) {
    console.error("Error deleting work experience:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { getUserWorkExperience, deleteWorkExperience };
