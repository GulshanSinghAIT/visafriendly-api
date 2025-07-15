const express = require("express");
const router = express.Router();

const h1bController = require("../../controllers/jobs/getH1bSponsorCases");

// GET /jobs/h1b-sponsor-cases?page=1&year=2023&company=google&role=engineer
router.get("/", h1bController.getH1bSponsorCases);

// GET /jobs/h1b-sponsor-cases/years - Get available years for filter dropdown
router.get("/years", h1bController.getAvailableYears);

// GET /jobs/h1b-sponsor-cases/stats - Get H1B statistics
router.get("/stats", h1bController.getH1bStats);

module.exports = router; 