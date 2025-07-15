const User = require("../../db/models/user");

const updateContact = async (req, res) => {
  try {
    const { email, mobileNumber, location } = req.body;

    if (!email) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await user.update({ email, mobileNumber, location });

    return res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { updateContact };
