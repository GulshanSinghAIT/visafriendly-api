const Education = require("../../db/models/education");

const updateEducation = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      email,
      universityName,
      courseName,
      degreeLevel,
      major,
      startDate,
      endDate,
    } = req.body;

    // Find the education entry
    const education = await Education.findByPk(id);
    if (!education) {
      return res.status(404).json({ message: "Education record not found" });
    }

    // Update education details
    await education.update({
      universityName,
      courseName,
      degreeLevel,
      major,
      startDate,
      endDate,
    });

    return res
      .status(200)
      .json({ message: "Education updated successfully", education });
  } catch (error) {
    console.error("Error updating education:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { updateEducation };
