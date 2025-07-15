const express = require("express");
const router = express.Router();

const savedJobsInsertController = require("../../controllers/jobs/insertSavedJob")
const savedJobsDeleteController = require("../../controllers/jobs/deleteSavedJob")
const appliedJobsInsertController  = require("../../controllers/jobs/insertAppliedJob")
const allAppliedController = require("../../controllers/jobs/getAppliedJobs")
const allSavedController = require("../../controllers/jobs/getSavedJobs")

router.get("/appliedJobs",allAppliedController.getAllApplied)
router.get("/savedJobs",allSavedController.getAllSaved)
router.post("/savedJobs/:id",savedJobsInsertController.insertSavedJob)
router.post("/appliedJobs/:id",appliedJobsInsertController.insertAppliedJob)
router.delete("/savedJobs/:id",savedJobsDeleteController.deleteSavedJob)

module.exports = router