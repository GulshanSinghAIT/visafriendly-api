const axios = require('axios');

const testLocalAPI = async () => {
    try {
        console.log('🧪 Testing Local API...\n');

        // Test health endpoint
        console.log('1. Testing health endpoint...');
        const healthResponse = await axios.get('http://localhost:5000/health');
        console.log('✅ Health check passed:', healthResponse.data);

        // Test job listings endpoint
        console.log('\n2. Testing job listings endpoint...');
        const jobsResponse = await axios.get('http://localhost:5000/jobs/listings', {
            params: {
                email: 'test@example.com',
                page: 1,
                limit: 15
            }
        });
        
        if (jobsResponse.data.success) {
            console.log('✅ Job listings working!');
            console.log(`   - Jobs returned: ${jobsResponse.data.jobs.length}`);
            console.log(`   - Total jobs: ${jobsResponse.data.pagination.totalJobs}`);
        } else {
            console.log('❌ Job listings failed:', jobsResponse.data);
        }

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.log('\n💡 Server is not running. Start it with: npm start');
        }
    }
};

if (require.main === module) {
    testLocalAPI();
}

module.exports = { testLocalAPI }; 