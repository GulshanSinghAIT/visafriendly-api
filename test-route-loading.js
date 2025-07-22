const express = require("express");
const app = express();

console.log('🧪 Testing Route Loading...\n');

try {
    console.log('1. Testing jobListings route import...');
    const jobListings = require("./src/routes/jobs/jobListings.js");
    console.log('✅ jobListings route imported successfully');
    console.log('   Routes in jobListings:', jobListings.stack ? jobListings.stack.length : 'No stack');
    
    // Test if the route is properly registered
    app.use("/jobs", jobListings);
    console.log('✅ jobListings route registered successfully');
    
    // Test if we can access the route
    console.log('\n2. Testing route registration...');
    const routes = [];
    app._router.stack.forEach(middleware => {
        if (middleware.route) {
            routes.push(middleware.route.path);
        } else if (middleware.name === 'router') {
            middleware.handle.stack.forEach(handler => {
                if (handler.route) {
                    routes.push(handler.route.path);
                }
            });
        }
    });
    
    console.log('Available routes:', routes);
    
} catch (error) {
    console.error('❌ Error loading jobListings route:', error.message);
    console.error('Stack trace:', error.stack);
}

console.log('\n🎉 Route loading test completed!'); 