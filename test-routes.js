const axios = require('axios');

async function testRoutes() {
  try {
    console.log('Testing server routes...');
    
    // Test health endpoint
    const healthResponse = await axios.get('http://localhost:5000/health');
    console.log('✅ Health endpoint working:', healthResponse.status);
    
    // Test jobs listings endpoint
    try {
      const jobsResponse = await axios.get('http://localhost:5000/jobs/listings?email=test@example.com');
      console.log('✅ Jobs listings endpoint working:', jobsResponse.status);
    } catch (error) {
      console.log('❌ Jobs listings endpoint error:', error.response?.status, error.response?.data?.message);
    }
    
    // Test bulk insert endpoint
    try {
      const bulkResponse = await axios.post('http://localhost:5000/jobs/bulk-insert', {
        jobs: []
      });
      console.log('✅ Bulk insert endpoint working:', bulkResponse.status);
    } catch (error) {
      console.log('❌ Bulk insert endpoint error:', error.response?.status, error.response?.data?.message);
    }
    
  } catch (error) {
    console.error('Error testing routes:', error.message);
  }
}

testRoutes(); 