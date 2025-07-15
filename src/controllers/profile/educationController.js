const User = require("../../db/models/user");
const Education = require("../../db/models/education");

const educationController = async (req, res) => {
  try {
    const {
      email,
      universityName,
      courseName,
      degreeLevel,
      major,
      startDate,
      endDate,
    } = req.body;

    // Validate required fields
    if (
      !email ||
      !universityName ||
      !courseName ||
      !degreeLevel ||
      !startDate
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create education entry
    const education = await Education.create({
      universityName,
      courseName,
      degreeLevel,
      major,
      startDate,
      endDate,
    });

    // Associate the education with the user
    await user.addEducation(education);

    return res
      .status(201)
      .json({ message: "Education added successfully", education });
  } catch (error) {
    console.error("Error adding education:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { educationController };
