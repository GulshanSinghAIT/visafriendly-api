// controllers/profile/profileController.js
import User from "../../db/models/user.js";
import JobType from "../../db/models/jobtype.js";
import OpenRole from "../../db/models/openrole.js";
import Skill from "../../db/models/skill.js";
import UserOpenRole from "../../db/models/userOpenRoleJoinTable.js";
import SocialProfile from "../../db/models/socialprofile.js";
import sequelize from "../../config/database.js";

const getProfile = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: JobType,
          as: "jobTypes",
          attributes: ["id", "name"],
          through: { attributes: [] },
        },
        {
          model: OpenRole,
          as: "openRoles",
          attributes: ["id", "name"],
          through: { attributes: ["yearsOfExperience"] },
        },
        {
          model: Skill,
          attributes: ["id", "name", "experienceInYears"],
          through: { attributes: [] },
        },
      ],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Format the response
    const formattedResponse = {
      firstName: user.firstName,
      lastName: user.lastName,
      Summary: user.Summary,
      email: user.email,
      yearsOfExperience: user.yearsOfExperience,
      jobTypes: user.jobTypes.map((jobType) => ({
        id: jobType.id,
        name: jobType.name,
      })),
      openRoles: user.openRoles.map((role) => ({
        id: role.id,
        name: role.name,
        yearsOfExperience: role.UserOpenRole.yearsOfExperience,
      })),
      skills: user.Skills.map((skill) => ({
        name: skill.name,
        experienceInYears: skill.experienceInYears,
      })),
    };

    return res.status(200).json({
      success: true,
      data: formattedResponse,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const {
      user: userData,
      jobTypes,
      openRoles,
      skills,
      socialLinks, // Add socialLinks to destructuring
    } = req.body;

    if (!userData.email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Update user basic info
    const user = await User.findOne({ where: { email: userData.email } });
    if (!user) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update user basic information
    await user.update(
      {
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        yearsOfExperience: userData.yearsOfExperience,
      },
      { transaction: t }
    );

    // Update job types
    if (jobTypes && jobTypes.length > 0) {
      // Find job types by name
      const jobTypeRecords = await JobType.findAll({
        where: {
          name: jobTypes.map((jt) => jt.name),
        },
        transaction: t,
      });

      // Get the actual numeric IDs
      const jobTypeIds = jobTypeRecords.map((jt) => jt.id);

      // Set job types using the numeric IDs
      await user.setJobTypes(jobTypeIds, { transaction: t });
    }

    // Update open roles
    if (openRoles && openRoles.length > 0) {
      // Remove existing roles
      await UserOpenRole.destroy({
        where: { userId: user.id },
        transaction: t,
      });

      // Prepare to store roles with their IDs
      const processedRoles = [];

      // Process each role
      for (const role of openRoles) {
        // Map frontend role ID to OpenRole name
        const roleMapping = {
          softwareEngineer: "Software Engineer",
          productManager: "Product Manager",
          // Add more mappings as needed
        };

        // Determine the role name
        const roleName =
          roleMapping[role.id] ||
          (typeof role.id === "string"
            ? role.id
                .split(/(?=[A-Z])/)
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")
            : role.id);

        // Find or create the role
        let [openRoleRecord, created] = await OpenRole.findOrCreate({
          where: { name: roleName },
          defaults: { name: roleName },
          transaction: t,
        });

        // Check if this role already exists for the user
        const existingUserRole = await UserOpenRole.findOne({
          where: {
            userId: user.id,
            openRoleId: openRoleRecord.id,
          },
          transaction: t,
        });

        // If role doesn't exist for the user, create it
        if (!existingUserRole) {
          const userOpenRole = await UserOpenRole.create(
            {
              userId: user.id,
              openRoleId: openRoleRecord.id,
              yearsOfExperience:
                role.yearsOfExperience || userData.yearsOfExperience,
            },
            { transaction: t }
          );

          processedRoles.push({
            openRoleId: openRoleRecord.id,
            created: created,
          });
        }
      }

      // Log newly created roles
      const newRoles = processedRoles.filter((role) => role.created);
    }
    // Update skills
    if (skills && skills.length > 0) {
      const skillIds = [];
      for (const skillData of skills) {
        const [skill] = await Skill.findOrCreate({
          where: { name: skillData.name },
          defaults: {
            name: skillData.name,
            experienceInYears: skillData.experienceInYears,
          },
          transaction: t,
        });
        skillIds.push(skill.id);
      }

      // Set the skills for the user
      await user.setSkills(skillIds, { transaction: t });
    }

    // Update Social Profiles
    if (socialLinks) {
      // Remove existing social profiles
      await SocialProfile.destroy({
        where: { userId: user.id },
        transaction: t,
      });

      // Create new social profiles
      const socialProfilesToCreate = Object.entries(socialLinks)
        .filter(([_, link]) => link) // Filter out empty links
        .map(([websiteName, link]) => ({
          userId: user.id,
          websiteName:
            websiteName.charAt(0).toUpperCase() + websiteName.slice(1),
          link,
        }));

      if (socialProfilesToCreate.length > 0) {
        await SocialProfile.bulkCreate(socialProfilesToCreate, {
          transaction: t,
        });
      }
    }

    await t.commit();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    await t.rollback();
    console.error("Error updating profile:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

export { getProfile, updateProfile };
