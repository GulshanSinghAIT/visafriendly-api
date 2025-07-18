const Resume = require("../../db/models/resume");
const User = require("../../db/models/user");

const resumeController = async (req, res) => {
  try {
    const { fileName, email, isDefault } = req.body;

    if (!fileName || !email) {
      return res.status(400).json({ error: "Filename and email are required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newResume = await Resume.create({
      userId: user.id,
      fileName: fileName, // Store only filename
      filePath: "abc", // No file path
      isDefault,
    });

    res.status(201).json({
      id: newResume.id,
      fileName: newResume.fileName,
      uploadDate: new Date().toISOString().split("T")[0], // Match frontend format
      iconSrc:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/f1dd8375a5af3296031fcefe3c6548e05df2b0f212157ea8dedaae6a5719d9ac",
      actionIconSrc:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/95fbd36175aa814b913df00b5649797f6bee7ca5ee3f7aa114fcae7934f1c7e8",
      isDefault: false,
    });
  } catch (error) {
    console.error("Error saving resume:", error);
    res.status(500).json({ error: "Server error while saving resume" });
  }
};

module.exports = { resumeController };
