const express = require("express");
const router = express.Router();

// Simple test route first
router.get("/test-simple", (req, res) => {
    res.json({
        success: true,
        message: "Simple test route working",
        timestamp: new Date().toISOString()
    });
});

// Try to import controllers one by one
try {
    const { getJobListings } = require("../../controllers/jobs/getJobListings");
    router.get("/listings", getJobListings);
    console.log("✅ getJobListings route added");
} catch (error) {
    console.error("❌ Error loading getJobListings:", error.message);
    router.get("/listings", (req, res) => {
        res.json({
            success: false,
            message: "getJobListings controller failed to load",
            error: error.message
        });
    });
}

try {
    const { bulkInsertJobs, clearAllJobs } = require("../../controllers/jobs/bulkInsertJobs");
    router.post("/bulk-insert", bulkInsertJobs);
    router.delete("/clear-all", clearAllJobs);
    console.log("✅ bulkInsertJobs routes added");
} catch (error) {
    console.error("❌ Error loading bulkInsertJobs:", error.message);
}

// Import saved and applied job controllers
try {
    const savedJobsInsertController = require("../../controllers/jobs/insertSavedJob");
    const savedJobsDeleteController = require("../../controllers/jobs/deleteSavedJob");
    const appliedJobsInsertController = require("../../controllers/jobs/insertAppliedJob");
    const allAppliedController = require("../../controllers/jobs/getAppliedJobs");
    const allSavedController = require("../../controllers/jobs/getSavedJobs");

    router.get("/appliedJobs", allAppliedController.getAllApplied);
    router.get("/savedJobs", allSavedController.getAllSaved);
    router.post("/savedJobs/:id", savedJobsInsertController.insertSavedJob);
    router.post("/appliedJobs/:id", appliedJobsInsertController.insertAppliedJob);
    router.delete("/savedJobs/:id", savedJobsDeleteController.deleteSavedJob);
    console.log("✅ Saved/applied job routes added");
} catch (error) {
    console.error("❌ Error loading saved/applied job controllers:", error.message);
}

module.exports = router; 