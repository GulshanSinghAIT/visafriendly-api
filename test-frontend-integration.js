const axios = require('axios');

const testFrontendIntegration = async () => {
    try {
        console.log('🧪 Testing Frontend Integration...\n');

        // Test 1: Health check
        console.log('1. Testing health endpoint...');
        const healthResponse = await axios.get('http://localhost:5000/health');
        console.log('✅ Health check passed:', healthResponse.data);

        // Test 2: Job listings without filters
        console.log('\n2. Testing job listings endpoint...');
        const jobsResponse = await axios.get('http://localhost:5000/jobs/listings', {
            params: {
                email: 'test@example.com',
                page: 1,
                limit: 15
            }
        });
        
        if (jobsResponse.data.success) {
            console.log('✅ Job listings working:');
            console.log(`   - Total jobs: ${jobsResponse.data.pagination.totalJobs}`);
            console.log(`   - Jobs returned: ${jobsResponse.data.jobs.length}`);
            console.log(`   - Current page: ${jobsResponse.data.pagination.currentPage}`);
            console.log(`   - Total pages: ${jobsResponse.data.pagination.totalPages}`);
            console.log(`   - User plan: ${jobsResponse.data.userPlan.isPaidUser ? 'Paid' : 'Free'}`);
            
            // Check if job data has expected fields
            if (jobsResponse.data.jobs.length > 0) {
                const firstJob = jobsResponse.data.jobs[0];
                console.log('\n   Sample job fields:');
                console.log(`   - title: ${firstJob.title}`);
                console.log(`   - company: ${firstJob.company}`);
                console.log(`   - location: ${firstJob.location}`);
                console.log(`   - workSetting: ${firstJob.workSetting}`);
                console.log(`   - exp: ${firstJob.exp}`);
                console.log(`   - salary: ${firstJob.salary}`);
                console.log(`   - date: ${firstJob.date}`);
                console.log(`   - skills: ${firstJob.skills ? firstJob.skills.substring(0, 50) + '...' : 'N/A'}`);
            }
        } else {
            console.log('❌ Job listings failed:', jobsResponse.data);
        }

        // Test 3: Job listings with filters
        console.log('\n3. Testing job listings with filters...');
        const filteredResponse = await axios.get('http://localhost:5000/jobs/listings', {
            params: {
                email: 'test@example.com',
                page: 1,
                limit: 15,
                filters: JSON.stringify({
                    jobType: 'Full-Time',
                    workSetting: 'Remote'
                })
            }
        });
        
        if (filteredResponse.data.success) {
            console.log('✅ Filtered job listings working:');
            console.log(`   - Filtered jobs returned: ${filteredResponse.data.jobs.length}`);
        } else {
            console.log('❌ Filtered job listings failed:', filteredResponse.data);
        }

        console.log('\n🎉 Frontend integration tests completed successfully!');
        console.log('\n📋 Next steps:');
        console.log('1. Start the frontend: cd ../client && npm start');
        console.log('2. Navigate to the jobs page in your browser');
        console.log('3. Test pagination, filters, and plan-based access');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.log('\n💡 Make sure the server is running: npm start');
        }
    }
};

if (require.main === module) {
    testFrontendIntegration();
}

module.exports = { testFrontendIntegration }; 