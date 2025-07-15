const { User, Skill } = require("../../db/models");

exports.skillController = async (req, res) => {
  try {
    const { email, skills } = req.body;

    // Check if the user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Process each skill
    const skillInstances = await Promise.all(
      skills.map(async (skillName) => {
        // Find or create skill
        const [skill] = await Skill.findOrCreate({
          where: { name: skillName.name },
        });

        return skill;
      })
    );

    // Associate skills with the user using Sequelize's many-to-many helper method
    await user.addSkills(skillInstances);

    res.status(201).json({
      message: "Skills submitted successfully",
      skills: skillInstances.map((s) => ({ id: s.id, name: s.name })),
    });
  } catch (error) {
    console.error("Error submitting skills:", error);
    res.status(500).json({ error: "Server error while submitting skills" });
  }
};
