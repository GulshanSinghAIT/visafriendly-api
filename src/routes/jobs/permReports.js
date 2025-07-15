const express = require("express");
const router = express.Router();

const permController = require("../../controllers/jobs/getPermReports");

// GET /jobs/perm-reports?page=1&year=2023&company=google&role=engineer
router.get("/", permController.getPermReports);

// GET /jobs/perm-reports/years - Get available years for filter dropdown
router.get("/years", permController.getAvailableYears);

// GET /jobs/perm-reports/stats - Get PERM statistics
router.get("/stats", permController.getPermStats);

module.exports = router; 