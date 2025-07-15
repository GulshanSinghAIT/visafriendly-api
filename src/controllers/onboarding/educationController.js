const Education = require("../../db/models/education");
const User = require("../../db/models/user");

exports.educationController = async (req, res) => {
  try {
    const { school, major, degree, gpa, startMonth, startYear, endMonth, endYear, email } = req.body;

    if (!school || !major || !degree || !startMonth || !startYear || !endMonth || !endYear || !email) {
      return res.status(400).json({ error: "All fields are required except GPA" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newEducation = await Education.create({
      userId: user.id,
      school,
      major,
      degree,
      gpa,
      startMonth,
      startYear,
      endMonth,
      endYear
    });

    res.status(201).json({
      success: true,
      data: newEducation
    });
  } catch (error) {
    console.error("Error saving education:", error);
    res.status(500).json({ error: "Server error while saving education" });
  }
};

exports.getEducation = async (req, res) => {
  try {
    const { email } = req.params;
    
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const educationEntries = await Education.findAll({
      where: { userId: user.id },
      order: [['startYear', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: educationEntries
    });
  } catch (error) {
    console.error("Error fetching education:", error);
    res.status(500).json({ error: "Server error while fetching education" });
  }
};

exports.updateEducation = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;
    const updateData = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const education = await Education.findOne({
      where: { id, userId: user.id }
    });

    if (!education) {
      return res.status(404).json({
        success: false,
        message: 'Education entry not found'
      });
    }

    await education.update(updateData);

    res.status(200).json({
      success: true,
      data: education
    });
  } catch (error) {
    console.error("Error updating education:", error);
    res.status(500).json({ error: "Server error while updating education" });
  }
};

exports.deleteEducation = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const education = await Education.findOne({
      where: { id, userId: user.id }
    });

    if (!education) {
      return res.status(404).json({
        success: false,
        message: 'Education entry not found'
      });
    }

    await education.destroy();

    res.status(200).json({
      success: true,
      message: 'Education entry deleted successfully'
    });
  } catch (error) {
    console.error("Error deleting education:", error);
    res.status(500).json({ error: "Server error while deleting education" });
  }
}; 