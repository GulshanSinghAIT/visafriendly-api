const express = require('express');
const router = express.Router();
const { educationController, getEducation, updateEducation, deleteEducation } = require('../../controllers/onboarding/educationController');

// Create new education entry
router.post('/', educationController);

// Get all education entries for a user
router.get('/:email', getEducation);

// Update an education entry
router.put('/:id', updateEducation);

// Delete an education entry
router.delete('/:id', deleteEducation);

module.exports = router; 