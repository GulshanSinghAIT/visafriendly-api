// controllers/settingsController.js
const User = require("../../db/models/user");

// Update password
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, email } = req.body;

    // Find user
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify current password
    if (currentPassword !== user.passwordHash) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Update password directly
    await user.update({ passwordHash: newPassword });

    res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  updatePassword,
};
