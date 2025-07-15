const User = require("../../db/models/user");
const JobType = require("../../db/models/jobtype");
const WorkSettingPreference = require("../../db/models/worksettingpreference");
const { sequelize } = require("../../db/models");

// POST: Save or update preferences
const preferenceController = async (req, res) => {
  try {
    const {
      jobTypes,
      workSettings,
      expectedSalary,
      email,
    } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (jobTypes && jobTypes.length) {
      const jobTypeRecords = await Promise.all(
        jobTypes.map(async (name) => {
          const [jobType] = await JobType.findOrCreate({
            where: { name: name.trim() },
          });
          return jobType;
        })
      );
      await user.setJobTypes(jobTypeRecords);
    }

    if (workSettings && workSettings.length) {
      const workSettingRecords = await Promise.all(
        workSettings.map(async (name) => {
          const [workSetting] = await WorkSettingPreference.findOrCreate({
            where: { name: name.trim() },
          });
          return workSetting;
        })
      );
      await user.setWorkSettings(workSettingRecords);
    }

    if (expectedSalary !== undefined && expectedSalary !== null) {
      await user.update({ expectedSalary: parseFloat(expectedSalary) });
    }

    return res.status(200).json({
      message: "Preferences updated successfully",
      userId: user.id,
    });
  } catch (error) {
    console.error("Error updating preferences:", error);
    return res.status(500).json({
      message: "Error updating preferences",
      error: error.message,
    });
  }
};

// GET: Fetch existing preferences by email
const getPreferenceController = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({
      where: { email },
      include: [
        { model: JobType, as: 'jobTypes' },
        { model: WorkSettingPreference, as: 'workSettings' }
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      jobTypes: user.jobTypes ? user.jobTypes.map((jt) => jt.name) : [],
      workSettings: user.workSettings ? user.workSettings.map((ws) => ws.name) : [],
      expectedSalary: user.expectedSalary,
    });
  } catch (error) {
    console.error("Error fetching preferences:", error);
    return res.status(500).json({
      message: "Error fetching preferences",
      error: error.message,
    });
  }
};

module.exports = {
  preferenceController,        // POST
  getPreferenceController,     // GET
};
