const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const axios = require('axios');

// Function to read CSV file and convert to JSON
const readCsvFile = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
};

// Function to migrate jobs from CSV to database
const migrateJobsFromCsv = async () => {
  try {
    console.log('Starting job migration from CSV...');
    
    // Path to your CSV file (adjust as needed)
    const csvFilePath = path.join(__dirname, '../../client/public/jobDataCsv/visafriendlyjobs.csv');
    
    if (!fs.existsSync(csvFilePath)) {
      console.error('CSV file not found:', csvFilePath);
      return;
    }
    
    // Read CSV file
    const jobsData = await readCsvFile(csvFilePath);
    console.log(`Found ${jobsData.length} jobs in CSV file`);
    
    // Transform data to match our API expectations
    const transformedJobs = jobsData.map(job => ({
      company_name: job.company_name,
      job_title: job.job_title,
      years_of_experience: job.years_of_experience,
      min_experience: job.min_experience,
      location: job.location,
      Job_Type: job.Job_Type,
      work_setting: job.work_setting,
      min_salary: job.min_salary,
      max_salary: job.max_salary,
      startup_job: job.startup_job,
      job_posting_date: job.job_posting_date,
      visa_sponsoring: job.visa_sponsoring,
      sponsor_type: job.sponsor_type,
      apply_url: job.apply_url,
      Responsibilities_and_Requirements: job['Responsibilities and Requirements'],
      Company_Logo: job['Company Logo'],
      job_description: job.job_description,
      Job_Description: job['Job Description'],
      keywords_formatted: job.keywords_formatted,
      tags: job.tags || ''
    }));
    
    // Send to API
    const apiUrl = process.env.API_URL || 'http://localhost:5000';
    const response = await axios.post(`${apiUrl}/jobs/bulk-insert`, {
      jobs: transformedJobs
    });
    
    console.log('Migration completed successfully!');
    console.log('Response:', response.data);
    
  } catch (error) {
    console.error('Migration failed:', error.message);
    if (error.response) {
      console.error('API Error:', error.response.data);
    }
  }
};

// Run migration if this script is executed directly
if (require.main === module) {
  migrateJobsFromCsv();
}

module.exports = { migrateJobsFromCsv }; 