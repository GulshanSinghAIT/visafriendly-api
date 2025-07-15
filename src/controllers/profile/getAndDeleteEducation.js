const Education = require("../../db/models/education");
const User = require("../../db/models/user");

// Get all education records
const getEducation = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const education = await Education.findAll({
      include: [
        {
          model: User,
          where: { id: user.id },
          attributes: [],
          through: { attributes: [] },
        },
      ],
    });

    res.json(education);
  } catch (error) {
    console.error("Error fetching education:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a specific education record
const deleteEducation = async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  try {
    const education = await Education.findOne({ where: { id } });

    if (!education) {
      return res.status(404).json({ message: "Education not found" });
    }

    // Verify if the education entry belongs to the user
    const userEducation = await education.getUsers({ where: { email } });

    if (!userEducation.length) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this education" });
    }

    await education.destroy({ force: true });
    res.json({ message: "Education deleted successfully" });
  } catch (error) {
    console.error("Error deleting education:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getEducation, deleteEducation };
