import express from "express";
import { getProfile, updateProfile } from "../../controllers/profile/general.js";
import educationController from "../../controllers/profile/educationController.js";
import workExperienceController from "../../controllers/profile/workExperienceController.js";
import jobAlertController from "../../controllers/profile/jobAlertController.js";
import getAlertCardsController from "../../controllers/profile/getAlertCards.js";
import { updateJobAlert } from "../../controllers/profile/updateJobAlert.js";
import { deleteJobAlert, deleteAllJobAlerts } from "../../controllers/profile/deleteAlert.js";
import { updateEducation } from "../../controllers/profile/updateEducation.js";
import { updateContact } from "../../controllers/profile/updateContact.js";
import { getUserWorkExperience, deleteWorkExperience } from "../../controllers/profile/deleteAndGetWork.js";
import { getEducation, deleteEducation } from "../../controllers/profile/getAndDeleteEducation.js";
import { updateWorkExperience } from "../../controllers/profile/updateWorkExperience.js";
import { getContactInfo } from "../../controllers/profile/getContact.js";
import { getUserResumes, setDefaultResume, deleteResume, uploadResume } from "../../controllers/profile/Resume.js";
import { getUserData } from "../../controllers/profile/avatar.js";

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
router.post("/education", educationController.educationController);
router.post("/getEducation", getEducation);
router.delete("/deleteEducation/:id", deleteEducation);
router.put("/updateEducation/:id", updateEducation);

// JOB ALERT CARDS
router.post("/jobAlert", jobAlertController.jobAlertController);
router.post("/getAlertCards", getAlertCardsController.getUserJobAlerts);
router.delete("/deleteAlert/:id", deleteJobAlert);
router.delete("/deleteAllAlerts", deleteAllJobAlerts);
router.put("/updateAlert/:id", updateJobAlert);

// WORK EXPERIENCE
router.post("/workExperience", workExperienceController.workExperienceController);
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

export default router;
