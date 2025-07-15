const express = require('express');
const router = express.Router();
const { createLinks, getLinks, updateLinks, deleteLinks } = require('../../controllers/onboarding/linksController');

// Create new links entry
router.post('/', createLinks);

// Get links for a user
router.get('/:email', getLinks);

// Update a links entry
router.put('/:id', updateLinks);

// Delete a links entry
router.delete('/:id', deleteLinks);

module.exports = router; 