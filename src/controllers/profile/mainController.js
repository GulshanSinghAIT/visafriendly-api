const User = require("../../db/models/user");
const JobType = require("../../db/models/jobType");
const UserOpenRole = require("../../db/models/userOpenRoleJoinTable");
const OpenRole = require("../../db/models/openRole");
const Skill = require("../../db/models/skill");
const Education = require("../../db/models/education");
const SocialProfile = require("../../db/models/socialProfile");

const mainController = async (req, res) => {
  try {
    const { user: userInfo, profile, skills, email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Extract user and profile information
    const firstName = userInfo?.firstName || null;
    const lastName = userInfo?.lastName || null;
    const primaryRole = profile?.primaryRole || null;
    const experience = profile?.yearsOfExperience || null;
    const selectedJobTypes = profile?.preferredJobTypes || [];
    const selectedRoles = profile?.openToRoles?.map((role) => role.name) || [];

    // Find existing user
    let user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user details
    user.firstName = firstName;
    user.lastName = lastName;
    user.role = primaryRole;
    user.yearsOfExperience = experience;
    await user.save();

    // await user.setJobTypes([]);
    await JobType.truncate({ cascade: true });
    const jobTypes = await Promise.all(
      selectedJobTypes.map(async (jobTypeName) => {
        const [jobType] = await JobType.findOrCreate({
          where: { name: jobTypeName },
          defaults: { name: jobTypeName },
        });
        return jobType;
      })
    );

    await user.setJobTypes(jobTypes.map((jobType) => jobType.id));

    // Fetch Open Role IDs from OpenRole table based on role names
    if (selectedRoles.length > 0) {
      // Find or create OpenRole records
      const openRoles = await Promise.all(
        selectedRoles.map((name) => OpenRole.findOrCreate({ where: { name } }))
      );

      // Extract OpenRole IDs instead of instances
      const openRoleIds = openRoles.map(([role]) => role.id);

      // Set user roles using IDs
      await user.setOpenRoles(openRoleIds);
    }

    // Update Skills (Many-to-Many)
    if (skills && skills.length > 0) {
      const skillInstances = await Promise.all(
        skills.map(async (skill) => {
          const [skillRecord] = await Skill.findOrCreate({
            where: {
              name: skill.name,
              experienceInYears: skill.yearsOfExperience,
            },
          });
          return skillRecord;
        })
      );
      await user.setSkills(skillInstances);
    }

    return res.status(200).json({ message: "Profile data saved successfully" });
  } catch (error) {
    console.error("Error saving profile data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { mainController };
