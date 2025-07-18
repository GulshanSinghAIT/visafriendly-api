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

// Debug route for contact details testing
router.post("/contactDetails/debug", (req, res) => {
  console.log('\n=== Contact Details Debug ===');
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('Content-Type:', req.get('Content-Type'));
  
  const requiredFields = ['firstName', 'lastName', 'email', 'mobile', 'password', 'referralSource'];
  const missingFields = requiredFields.filter(field => !req.body[field]);
  
  res.json({
    message: "Contact details debug endpoint",
    receivedFields: Object.keys(req.body),
    requiredFields,
    missingFields,
    fieldValues: {
      firstName: req.body.firstName || 'MISSING',
      lastName: req.body.lastName || 'MISSING', 
      email: req.body.email || 'MISSING',
      mobile: req.body.mobile || 'MISSING',
      password: req.body.password ? 'PROVIDED' : 'MISSING',
      referralSource: req.body.referralSource || 'MISSING',
      city: req.body.city || 'OPTIONAL',
      state: req.body.state || 'OPTIONAL',
      Summary: req.body.Summary || 'OPTIONAL'
    },
    isValid: missingFields.length === 0,
    timestamp: new Date().toISOString()
  });
});

// Route to create a new user
router.post("/contactDetails", contactController);
router.post("/preferences", preferenceController);
router.get("/getpreferences", getPreferenceController);
router.post("/resumeUpload", resumeController);
router.post("/skills", skillController);

module.exports = router;
