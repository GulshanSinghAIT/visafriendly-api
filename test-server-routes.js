const axios = require('axios');

const testServerRoutes = async () => {
    try {
        console.log('🧪 Testing Server Routes...\n');

        // Test 1: Check if server is running
        console.log('1. Testing server health...');
        const healthResponse = await axios.get('http://localhost:5000/health');
        console.log('✅ Server is running');

        // Test 2: Check available routes
        console.log('\n2. Testing available routes...');
        const debugResponse = await axios.post('http://localhost:5000/debug', {
            test: 'routes'
        });
        console.log('✅ Debug endpoint working');

        // Test 3: Test jobs base route
        console.log('\n3. Testing jobs base route...');
        try {
            const jobsBaseResponse = await axios.get('http://localhost:5000/jobs');
            console.log('✅ Jobs base route working');
        } catch (error) {
            console.log('❌ Jobs base route failed:', error.response?.status);
        }

        // Test 4: Test jobs listings route directly
        console.log('\n4. Testing jobs listings route...');
        try {
            const listingsResponse = await axios.get('http://localhost:5000/jobs/listings', {
                params: {
                    email: 'test@example.com',
                    page: 1,
                    limit: 15
                }
            });
            console.log('✅ Jobs listings route working');
            console.log('   Response:', listingsResponse.data);
        } catch (error) {
            console.log('❌ Jobs listings route failed:', error.response?.status);
            console.log('   Error:', error.response?.data);
        }

        // Test 5: Test with different parameters
        console.log('\n5. Testing with minimal parameters...');
        try {
            const minimalResponse = await axios.get('http://localhost:5000/jobs/listings?email=test@example.com');
            console.log('✅ Minimal parameters working');
        } catch (error) {
            console.log('❌ Minimal parameters failed:', error.response?.status);
            console.log('   Error:', error.response?.data);
        }

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
};

if (require.main === module) {
    testServerRoutes();
}

module.exports = { testServerRoutes }; 