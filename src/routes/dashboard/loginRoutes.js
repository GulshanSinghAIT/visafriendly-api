const express = require('express');
const router = express.Router();
const { recordLogin, getLoginDatesForMonth, getCurrentStreak } = require('../../controllers/dashboard/loginController');

// Record a login (POST)
router.post('/record', recordLogin);

// Get login dates for a specific month (GET)
router.get('/:email/month', getLoginDatesForMonth);

// Get current streak information (GET)
router.get('/:email/streak', getCurrentStreak);

module.exports = router; 