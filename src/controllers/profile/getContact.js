import { createRequire } from "module";
const require = createRequire(import.meta.url);

const User = require("../../db/models/user");

const getContactInfo = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({
      where: { email },
      attributes: ["email", "mobileNumber", "location"], // Only select needed fields
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching contact info:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { getContactInfo };
