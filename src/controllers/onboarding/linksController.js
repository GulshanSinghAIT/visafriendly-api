const Links = require("../../db/models/links");
const User = require("../../db/models/user");

exports.createLinks = async (req, res) => {
  try {
    const { email, linkedin, github, portfolio, other } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const newLinks = await Links.create({
      userId: user.id,
      linkedin,
      github,
      portfolio,
      other
    });
    res.status(201).json({ success: true, data: newLinks });
  } catch (error) {
    console.error("Error saving links:", error);
    res.status(500).json({ error: "Server error while saving links" });
  }
};

exports.getLinks = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const links = await Links.findOne({ where: { userId: user.id } });
    res.status(200).json({ success: true, data: links });
  } catch (error) {
    console.error("Error fetching links:", error);
    res.status(500).json({ error: "Server error while fetching links" });
  }
};

exports.updateLinks = async (req, res) => {
  try {
    const { email } = req.body;
    const { id } = req.params;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const links = await Links.findOne({ where: { id, userId: user.id } });
    if (!links) {
      return res.status(404).json({ success: false, message: "Links entry not found" });
    }
    await links.update(req.body);
    res.status(200).json({ success: true, data: links });
  } catch (error) {
    console.error("Error updating links:", error);
    res.status(500).json({ error: "Server error while updating links" });
  }
};

exports.deleteLinks = async (req, res) => {
  try {
    const { email } = req.body;
    const { id } = req.params;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const links = await Links.findOne({ where: { id, userId: user.id } });
    if (!links) {
      return res.status(404).json({ success: false, message: "Links entry not found" });
    }
    await links.destroy();
    res.status(200).json({ success: true, message: "Links entry deleted successfully" });
  } catch (error) {
    console.error("Error deleting links:", error);
    res.status(500).json({ error: "Server error while deleting links" });
  }
}; 