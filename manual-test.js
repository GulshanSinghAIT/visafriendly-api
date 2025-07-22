const http = require('http');

function testEndpoint(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          data: JSON.parse(data)
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

async function runTests() {
  console.log('🧪 Manual testing job system...\n');
  
  try {
    // Test health endpoint
    console.log('1. Testing /health...');
    const health = await testEndpoint('/health');
    console.log(`✅ Status: ${health.status}`);
    console.log(`📊 Database: ${health.data.database}\n`);
    
    // Test jobs listings
    console.log('2. Testing /jobs/listings...');
    try {
      const jobs = await testEndpoint('/jobs/listings?email=test@example.com');
      console.log(`✅ Status: ${jobs.status}`);
      console.log(`📊 Success: ${jobs.data.success}`);
      console.log(`📄 Jobs: ${jobs.data.jobs?.length || 0}\n`);
    } catch (error) {
      console.log(`❌ Error: ${error.message}\n`);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

runTests(); 