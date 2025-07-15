const express = require("express");
const router = express.Router();

const { getUser, updateUser } = require("../../controllers/settings/general");
const { updatePassword } = require("../../controllers/settings/changePassword");
const { deleteAccount, getDeleteReasons } = require("../../controllers/settings/deleteUser");
const {
  uploadProfilePicture,
} = require("../../controllers/settings/profilePic");
const {
  updateNotificationPreference,
  getUserNotificationPreferences,
  getAllNotifications,
} = require("../../controllers/settings/notification");
const { submitFeedback } = require("../../controllers/settings/feedback");

// General settings routes
router.post("/general", getUser);
router.put("/updateGeneral", updateUser);
router.put("/updatePassword", updatePassword);
router.delete("/deleteAccount", deleteAccount);
router.get("/deleteReasons", getDeleteReasons);

// Notification routes
router.put("/updateNotifications", updateNotificationPreference);
router.get("/getNotifications/:email", getUserNotificationPreferences);

// Feedback route
router.post("/feedback", submitFeedback);

// PROFILE PICTURE
router.post("/uploadProfilePicture", uploadProfilePicture);

module.exports = router;
