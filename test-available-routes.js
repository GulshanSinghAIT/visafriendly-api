const axios = require('axios');

async function testAvailableRoutes() {
  try {
    console.log('Testing available routes...');
    
    // Test debug endpoint to see available routes
    const debugResponse = await axios.post('http://localhost:5000/debug', {
      test: 'routes'
    });
    console.log('Debug response:', debugResponse.data);
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testAvailableRoutes(); 