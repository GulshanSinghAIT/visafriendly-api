console.log('🧪 Testing Controller Imports...\n');

try {
    console.log('1. Testing getJobListings import...');
    const { getJobListings } = require("./src/controllers/jobs/getJobListings");
    console.log('✅ getJobListings imported successfully');

    console.log('\n2. Testing bulkInsertJobs import...');
    const { bulkInsertJobs, clearAllJobs } = require("./src/controllers/jobs/bulkInsertJobs");
    console.log('✅ bulkInsertJobs imported successfully');

    console.log('\n3. Testing saved jobs controllers...');
    const savedJobsInsertController = require("./src/controllers/jobs/insertSavedJob");
    const savedJobsDeleteController = require("./src/controllers/jobs/deleteSavedJob");
    const appliedJobsInsertController = require("./src/controllers/jobs/insertAppliedJob");
    const allAppliedController = require("./src/controllers/jobs/getAppliedJobs");
    const allSavedController = require("./src/controllers/jobs/getSavedJobs");
    console.log('✅ All saved/applied job controllers imported successfully');

    console.log('\n4. Testing route creation...');
    const express = require("express");
    const router = express.Router();
    
    router.get("/listings", getJobListings);
    router.post("/bulk-insert", bulkInsertJobs);
    router.delete("/clear-all", clearAllJobs);
    router.get("/appliedJobs", allAppliedController.getAllApplied);
    router.get("/savedJobs", allSavedController.getAllSaved);
    router.post("/savedJobs/:id", savedJobsInsertController.insertSavedJob);
    router.post("/appliedJobs/:id", appliedJobsInsertController.insertAppliedJob);
    router.delete("/savedJobs/:id", savedJobsDeleteController.deleteSavedJob);
    
    console.log('✅ All routes created successfully');
    console.log('   Routes created:', router.stack.length);

} catch (error) {
    console.error('❌ Error during import:', error.message);
    console.error('Stack trace:', error.stack);
}

console.log('\n🎉 Controller import test completed!'); 