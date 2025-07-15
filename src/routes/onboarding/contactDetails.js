import express from "express";
import { contactController } from "../../controllers/onboarding/contactController.js";
import { getPreferenceController, preferenceController } from "../../controllers/onboarding/preferenceController.js";
import { resumeController } from "../../controllers/onboarding/resumeController.js";
import { skillController } from "../../controllers/onboarding/skillController.js";
import User from "../../db/models/user.js";

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

export default router;
