const express = require("express");
const { getProfile, updateProfile } = require("../../controllers/profile/general.js");
const { educationController } = require("../../controllers/profile/educationController.js");
const { workExperienceController } = require("../../controllers/profile/workExperienceController.js");
const { jobAlertController } = require("../../controllers/profile/jobAlertController.js");
const getAlertCardsController = require("../../controllers/profile/getAlertCards.js");
const { updateJobAlert } = require("../../controllers/profile/updateJobAlert.js");
const { deleteJobAlert, deleteAllJobAlerts } = require("../../controllers/profile/deleteAlert.js");
const { updateEducation } = require("../../controllers/profile/updateEducation.js");
const { updateContact } = require("../../controllers/profile/updateContact.js");
const { getUserWorkExperience, deleteWorkExperience } = require("../../controllers/profile/deleteAndGetWork.js");
const { getEducation, deleteEducation } = require("../../controllers/profile/getAndDeleteEducation.js");
const { updateWorkExperience } = require("../../controllers/profile/updateWorkExperience.js");
const { getContactInfo } = require("../../controllers/profile/getContact.js");
const { getUserResumes, setDefaultResume, deleteResume, uploadResume } = require("../../controllers/profile/Resume.js");
const { getUserData } = require("../../controllers/profile/avatar.js");

const router = express.Router();

// Debug middleware
router.use((req, res, next) => {
  console.log('Profile Route:', req.method, req.path);
  next();
});

// GENERAL
router.get("/general/:email", getProfile);
router.put("/update", (req, res, next) => {
  console.log('Update Profile Route Hit:', req.body);
  updateProfile(req, res, next);
});

// EDUCATION
router.post("/education", educationController);
router.post("/getEducation", getEducation);
router.delete("/deleteEducation/:id", deleteEducation);
router.put("/updateEducation/:id", updateEducation);

// JOB ALERT CARDS
router.post("/jobAlert", jobAlertController);
router.post("/getAlertCards", getAlertCardsController);
router.delete("/deleteAlert/:id", deleteJobAlert);
router.delete("/deleteAllAlerts", deleteAllJobAlerts);
router.put("/updateAlert/:id", updateJobAlert);

// WORK EXPERIENCE
router.post("/workExperience", workExperienceController);
router.post("/getWorkCards", getUserWorkExperience);
router.delete("/deleteWorkCard/:id", deleteWorkExperience);
router.put("/updateWorkCard/:id", updateWorkExperience);

router.put("/updateContact", updateContact);
router.get("/contact", getContactInfo);

// RESUME
router.get("/resume/:email", getUserResumes);
router.put("/resume/setDefault", setDefaultResume);
router.delete("/resume/:id", deleteResume);
router.post("/resume/upload", uploadResume);

// AVATAR
router.get("/avatar/:email", getUserData);

module.exports = router;
