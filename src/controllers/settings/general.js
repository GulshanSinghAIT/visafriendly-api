const User = require("../../db/models/user");

// Get user details
const getUser = async (req, res) => {
  try {
    const { orgEmail } = req.body;
    const user = await User.findOne({ where: { email: orgEmail } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update user details
const updateUser = async (req, res) => {
  try {
    const { fullName, username, email, orgEmail } = req.body;
    const [firstName, ...lastNameParts] = fullName.split(" ");
    const lastName = lastNameParts.join(" ");

    const user = await User.findOne({ where: { email: orgEmail } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.update({
      firstName,
      lastName,
      username,
      email,
    });

    res.json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getUser,
  updateUser,
};
