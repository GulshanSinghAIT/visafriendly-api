const User = require("../../db/models/user");
const WorkExperience = require("../../db/models/workExperience");

const workExperienceController = async (req, res) => {
  try {
    const {
      email,
      companyName,
      companyDomain,
      jobTitle,
      startDate,
      endDate,
      currentWork,
      description,
    } = req.body;

    // Validate required fields
    if (!email || !companyName || !jobTitle || !startDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create work experience entry
    const workExperience = await WorkExperience.create({
      companyName,
      companyDomain,
      title: jobTitle,
      startDate,
      endDate: currentWork ? null : endDate, // Null if currently working
      currentWorkHere: currentWork,
      description,
    });

    // Associate the work experience with the user
    await user.addWorkExperience(workExperience);

    return res.status(201).json({
      message: "Work experience added successfully",
      workExperience,
    });
  } catch (error) {
    console.error("Error adding work experience:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { workExperienceController };
