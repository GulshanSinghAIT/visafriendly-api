const express = require("express");
const contactController = require("../../controllers/onboarding/contactController.js");
const { getPreferenceController, preferenceController } = require("../../controllers/onboarding/preferenceController.js");
const { resumeController } = require("../../controllers/onboarding/resumeController.js");
const { skillController } = require("../../controllers/onboarding/skillController.js");
const User = require("../../db/models/user.js");

const router = express.Router();

// Test route to verify database connection
router.get("/test", async (req, res) => {
  try {
    await User.findAll();
    res.json({ message: "Database connection successful" });
  } catch (error) {
    console.error("Database connection test failed:", error);
    res.status(500).json({ 
      error: "Database connection failed", 
      details: error.message 
    });
  }
});

// Route to create a new user
router.post("/contactDetails", contactController);
router.post("/preferences", preferenceController);
router.get("/getpreferences", getPreferenceController);
router.post("/resumeUpload", resumeController);
router.post("/skills", skillController);

module.exports = router;
