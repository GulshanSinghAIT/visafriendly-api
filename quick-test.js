const axios = require('axios');

async function quickTest() {
  try {
    console.log('🔍 Testing job system...\n');
    
    // Test 1: Health endpoint
    console.log('1. Testing health endpoint...');
    const health = await axios.get('http://localhost:5000/health');
    console.log('✅ Health endpoint working\n');
    
    // Test 2: Jobs listings endpoint
    console.log('2. Testing jobs listings endpoint...');
    try {
      const jobs = await axios.get('http://localhost:5000/jobs/listings?email=test@example.com');
      console.log('✅ Jobs listings endpoint working');
      console.log('📊 Response:', jobs.data.success ? 'Success' : 'Failed');
      console.log('📄 Jobs found:', jobs.data.jobs?.length || 0);
      console.log('📋 User plan:', jobs.data.userPlan?.isPaidUser ? 'Paid' : 'Free');
      console.log('');
    } catch (error) {
      console.log('❌ Jobs listings error:', error.response?.data?.message || error.message);
      console.log('');
    }
    
    // Test 3: Bulk insert endpoint
    console.log('3. Testing bulk insert endpoint...');
    try {
      const bulk = await axios.post('http://localhost:5000/jobs/bulk-insert', {
        jobs: [{
          company_name: 'Test Company',
          job_title: 'Test Job',
          location: 'Test Location',
          Job_Type: 'Full-Time',
          work_setting: 'Remote',
          startup_job: 'No',
          job_posting_date: new Date().toISOString(),
          visa_sponsoring: true,
          sponsor_type: 'Regular H-1B'
        }]
      });
      console.log('✅ Bulk insert endpoint working');
      console.log('📊 Inserted jobs:', bulk.data.insertedCount);
      console.log('');
    } catch (error) {
      console.log('❌ Bulk insert error:', error.response?.data?.message || error.message);
      console.log('');
    }
    
    console.log('🎉 Job system test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

quickTest(); 