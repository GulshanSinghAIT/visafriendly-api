const fs = require('fs');
const path = require('path');
const db = require('../src/db/models');
const PermReport = db.PermReport;
const sequelize = require('../src/config/database');

/**
 * Parse CSV data manually (simple parser for basic CSV files)
 * @param {string} csvContent - Raw CSV content
 * @returns {Array} Array of objects representing CSV rows
 */
function parseCSV(csvContent) {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));
  
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(value => value.trim().replace(/"/g, ''));
    if (values.length === headers.length) {
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || null;
      });
      data.push(row);
    }
  }
  
  return data;
}

/**
 * Map CSV row to PermReport model format
 * @param {Object} row - CSV row object
 * @returns {Object} Mapped object for database insertion
 */
function mapCSVRowToModel(row) {
  // Helper function to safely parse integers
  const safeParseInt = (value) => {
    if (!value || value === '' || value === 'null' || value === 'undefined') return null;
    const cleaned = value.toString().replace(/[^0-9]/g, '');
    const parsed = parseInt(cleaned);
    return isNaN(parsed) ? null : parsed;
  };

  // Helper function to combine location and state
  const combineLocation = (location, state) => {
    if (!location && !state) return null;
    if (!location) return state;
    if (!state) return location;
    return `${location}, ${state}`;
  };

  return {
    year: row.year || row.Year || row.YEAR,
    Employer: row.employer || row.Employer || row.EMPLOYER || row.company || row.Company,
    jobTitle: row.job_title || row.jobTitle || row.JobTitle || row['Job Title'] || row.title || row.position,
    experienceLevel: row.experience_level || row.experienceLevel || row['Experience Level'] || row.level || 'Not Specified',
    baseSalary: safeParseInt(row.base_salary || row.baseSalary || row['Base Salary'] || row.salary),
    Location: combineLocation(
      row.location || row.Location || row.LOCATION || row.city || row.City,
      row.state || row.State || row.STATE
    ),
    submitDate: safeParseInt(row.submit_date || row.submitDate || row['Submit Date']),
    decisionDate: safeParseInt(row.decision_date || row.decisionDate || row['Decision Date']),
    caseStatus: row.case_status || row.caseStatus || row['Case Status'] || row.status,
  };
}

/**
 * Upload PERM report data from CSV file
 * @param {string} csvFilePath - Path to the CSV file
 * @param {Object} options - Upload options
 */
async function uploadPermDataFromCSV(csvFilePath, options = {}) {
  const {
    batchSize = 1000,
    skipDuplicates = true,
    validateData = true
  } = options;

  try {
    console.log(`📁 Reading CSV file: ${csvFilePath}`);
    
    // Check if file exists
    if (!fs.existsSync(csvFilePath)) {
      throw new Error(`File not found: ${csvFilePath}`);
    }

    // Read and parse CSV
    const csvContent = fs.readFileSync(csvFilePath, 'utf8');
    const csvData = parseCSV(csvContent);
    
    console.log(`📊 Found ${csvData.length} records in CSV`);

    // Map CSV data to model format
    const mappedData = csvData.map(mapCSVRowToModel).filter(record => {
      if (validateData) {
        // Basic validation - year, jobTitle, and experienceLevel are required
        return record.year && record.jobTitle && record.experienceLevel;
      }
      return true;
    });

    console.log(`✅ ${mappedData.length} records passed validation`);

    // Insert data in batches
    let insertedCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < mappedData.length; i += batchSize) {
      const batch = mappedData.slice(i, i + batchSize);
      
      try {
        if (skipDuplicates) {
          // Insert with ignoreDuplicates option
          const result = await PermReport.bulkCreate(batch, {
            ignoreDuplicates: true,
            validate: true
          });
          insertedCount += result.length;
          skippedCount += batch.length - result.length;
        } else {
          const result = await PermReport.bulkCreate(batch, {
            validate: true
          });
          insertedCount += result.length;
        }

        console.log(`📈 Processed batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(mappedData.length/batchSize)}`);
      } catch (error) {
        console.error(`❌ Error in batch ${Math.floor(i/batchSize) + 1}:`, error.message);
        
        // Try inserting records one by one for this batch
        for (const record of batch) {
          try {
            await PermReport.create(record);
            insertedCount++;
          } catch (individualError) {
            skippedCount++;
            console.warn(`⚠️  Skipped record for year ${record.year}: ${individualError.message}`);
          }
        }
      }
    }

    console.log(`\n🎉 Upload completed!`);
    console.log(`✅ Successfully inserted: ${insertedCount} records`);
    console.log(`⚠️  Skipped/Duplicates: ${skippedCount} records`);
    console.log(`📊 Total processed: ${mappedData.length} records`);

  } catch (error) {
    console.error('❌ Error uploading PERM data:', error);
    throw error;
  }
}

/**
 * Main function to run the upload script
 */
async function main() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('🔗 Database connection established successfully.');

    // Get CSV file path from command line arguments
    const csvFilePath = process.argv[2];
    
    if (!csvFilePath) {
      console.log(`
🚀 PERM Report Data Upload Script

Usage: node uploadPermData.js <csv-file-path> [options]

Example:
  node uploadPermData.js ./data/perm_cases.csv
  node uploadPermData.js ./data/perm_cases.csv --batch-size=500 --skip-duplicates=false

Expected CSV Format:
  Year,Employer,Job Title,Experience Level,Base Salary,Location,State,Submit Date,Decision Date,Case Status
  2023,TechCorp,Software Engineer,Senior,95000,New York,NY,20230115,20230301,Approved
  2023,DataCorp,Data Analyst,Junior,75000,San Francisco,CA,20230120,20230315,Pending

CSV Column Mapping:
  Year → year (required)
  Employer → Employer
  Job Title → jobTitle (required)
  Experience Level → experienceLevel (required)
  Base Salary → baseSalary (converted to integer)
  Location + State → Location (combined as "Location, State")
  Submit Date → submitDate (converted to integer)
  Decision Date → decisionDate (converted to integer)
  Case Status → caseStatus

Note: Location and State columns are combined into a single Location field.
      `);
      process.exit(1);
    }

    // Parse additional options
    const options = {
      batchSize: 1000,
      skipDuplicates: true,
      validateData: true
    };

    // Simple argument parsing
    process.argv.slice(3).forEach(arg => {
      if (arg.startsWith('--batch-size=')) {
        options.batchSize = parseInt(arg.split('=')[1]);
      } else if (arg === '--skip-duplicates=false') {
        options.skipDuplicates = false;
      } else if (arg === '--validate-data=false') {
        options.validateData = false;
      }
    });

    console.log('⚙️  Upload options:', options);

    // Run the upload
    await uploadPermDataFromCSV(csvFilePath, options);

  } catch (error) {
    console.error('💥 Script failed:', error);
    process.exit(1);
  } finally {
    // Close database connection
    await sequelize.close();
    console.log('🔒 Database connection closed.');
  }
}

// Run the script if called directly
if (require.main === module) {
  main();
}

// Export functions for use in other modules
module.exports = {
  uploadPermDataFromCSV,
  parseCSV,
  mapCSVRowToModel
}; 