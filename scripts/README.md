# Data Upload Scripts

This directory contains scripts for uploading data from CSV files to the database.

## Available Scripts

### H1B Sponsor Case Data
- `uploadH1bData.js` - Upload H1B sponsor case data from CSV
- `clearH1bData.js` - Clear all H1B data from database

### PERM Report Data  
- `uploadPermData.js` - Upload PERM report data from CSV
- `clearPermData.js` - Clear all PERM data from database

---

# H1B Sponsor Case Data Upload Script

This script allows you to upload H1B sponsor case data from CSV files to the database.

## Prerequisites

1. Make sure you have run the migration to create the H1bSponsorCases table:
   ```bash
   cd server
   npx sequelize-cli db:migrate
   ```

2. Ensure your database connection is properly configured in `src/config/database.js`

## Usage

### Basic Usage
```bash
cd server
node scripts/uploadH1bData.js path/to/your/h1b_data.csv
```

### Advanced Usage with Options
```bash
# Custom batch size
node scripts/uploadH1bData.js data.csv --batch-size=500

# Don't skip duplicates (will fail on duplicate entries)
node scripts/uploadH1bData.js data.csv --skip-duplicates=false

# Disable data validation
node scripts/uploadH1bData.js data.csv --validate-data=false

# Combine multiple options
node scripts/uploadH1bData.js data.csv --batch-size=500 --skip-duplicates=false
```

## CSV Format

### Required CSV Headers
Your CSV file should contain the following columns (in any order):

- **year** (required): The year of the H1B case
- **job_title** (required): Job title/position
- **experience_level** (required): Experience level (e.g., Junior, Mid-Level, Senior)

### Optional CSV Headers
- **employer_name**: Company/employer name
- **base_salary**: Base salary (will be converted to integer)
- **location**: Job location
- **submit_date**: Case submission date (YYYYMMDD format)
- **start_date**: Job start date (YYYYMMDD format)
- **case_status**: Case status (integer)

### Alternative Column Names
The script is flexible and accepts various column name formats:

| Database Field | Accepted CSV Headers |
|---------------|---------------------|
| year | `year`, `Year`, `YEAR` |
| EmployerName | `employer_name`, `EmployerName`, `employer`, `company` |
| jobTitle | `job_title`, `jobTitle`, `title`, `position` |
| experienceLevel | `experience_level`, `experienceLevel`, `level` |
| baseSalary | `base_salary` |
| Location | `location`, `Location`, `city` |
| submitDate | `submit_date` |
| startDate | `start_date` |
| caseStatus | `case_status` |

## Sample CSV

See `sample_h1b_data.csv` for an example of the expected format:

```csv
year,employer_name,job_title,experience_level,base_salary,location,submit_date,start_date,case_status
2023,TechCorp Inc,Software Engineer,Senior,95000,New York,20230115,20230301,1
2023,DataCorp LLC,Data Analyst,Junior,75000,San Francisco,20230120,20230315,1
```

## Script Options

### --batch-size=N
- Default: 1000
- Controls how many records are inserted at once
- Larger batches are faster but use more memory

### --skip-duplicates=true/false
- Default: true
- When true, duplicate records (based on unique constraints) are skipped
- When false, the script will fail if duplicates are encountered

### --validate-data=true/false
- Default: true
- When true, records must have year, jobTitle, and experienceLevel
- When false, minimal validation is performed

## Output

The script provides detailed progress information:

```
🔗 Database connection established successfully.
⚙️  Upload options: { batchSize: 1000, skipDuplicates: true, validateData: true }
📁 Reading CSV file: ./data/h1b_cases.csv
📊 Found 1000 records in CSV
✅ 950 records passed validation
📈 Processed batch 1/1

🎉 Upload completed!
✅ Successfully inserted: 945 records
⚠️  Skipped/Duplicates: 5 records
📊 Total processed: 950 records
🔒 Database connection closed.
```

## Error Handling

- The script handles individual record errors gracefully
- If a batch fails, it will try inserting records one by one
- Detailed error messages are provided for debugging
- The database connection is properly closed even if errors occur

## Troubleshooting

### "User not found" Error
Make sure the H1bSponsorCase model is properly exported in your models directory.

### CSV Parsing Issues
- Ensure your CSV is properly formatted with commas as separators
- Check for special characters or line breaks within fields
- Verify that all rows have the same number of columns as the header

### Database Connection Issues
- Verify your database configuration in `src/config/database.js`
- Ensure the database server is running
- Check your database credentials and permissions

## Examples

### Upload with default settings
```bash
node scripts/uploadH1bData.js ./data/h1b_2023.csv
```

### Upload large file with smaller batches
```bash
node scripts/uploadH1bData.js ./data/large_h1b_data.csv --batch-size=100
```

### Upload and fail on any duplicate
```bash
node scripts/uploadH1bData.js ./data/h1b_data.csv --skip-duplicates=false
```

---

# PERM Report Data Upload Script

This script allows you to upload PERM report data from CSV files to the database.

## Prerequisites

1. Make sure you have run the migration to create the PermReports table:
   ```bash
   cd server
   npx sequelize-cli db:migrate
   ```

2. Ensure your database connection is properly configured in `src/config/database.js`

## Usage

### Basic Usage
```bash
cd server
node scripts/uploadPermData.js path/to/your/perm_data.csv
```

### Advanced Usage with Options
```bash
# Custom batch size
node scripts/uploadPermData.js data.csv --batch-size=500

# Don't skip duplicates (will fail on duplicate entries)
node scripts/uploadPermData.js data.csv --skip-duplicates=false

# Disable data validation
node scripts/uploadPermData.js data.csv --validate-data=false

# Combine multiple options
node scripts/uploadPermData.js data.csv --batch-size=500 --skip-duplicates=false
```

## CSV Format

### Required CSV Headers
Your CSV file should contain the following columns (in any order):

- **Year** (required): The year of the PERM case
- **Job Title** (required): Job title/position
- **Experience Level** (required): Experience level (e.g., Junior, Mid-Level, Senior)

### Optional CSV Headers
- **Employer**: Company/employer name
- **Base Salary**: Base salary (will be converted to integer)
- **Location**: Job location (city)
- **State**: State abbreviation (will be combined with Location)
- **Submit Date**: Case submission date (YYYYMMDD format)
- **Decision Date**: Case decision date (YYYYMMDD format)
- **Case Status**: Case status (e.g., Approved, Denied, Pending)

### Alternative Column Names
The script is flexible and accepts various column name formats:

| Database Field | Accepted CSV Headers |
|---------------|---------------------|
| year | `year`, `Year`, `YEAR` |
| Employer | `employer`, `Employer`, `company`, `Company` |
| jobTitle | `job_title`, `jobTitle`, `Job Title`, `title`, `position` |
| experienceLevel | `experience_level`, `experienceLevel`, `Experience Level`, `level` |
| baseSalary | `base_salary`, `baseSalary`, `Base Salary`, `salary` |
| Location | `location`, `Location`, `city`, `City` + `state`, `State` |
| submitDate | `submit_date`, `submitDate`, `Submit Date` |
| decisionDate | `decision_date`, `decisionDate`, `Decision Date` |
| caseStatus | `case_status`, `caseStatus`, `Case Status`, `status` |

**Note**: Location and State are automatically combined into a single Location field as "City, State"

## Sample CSV

```csv
Year,Employer,Job Title,Experience Level,Base Salary,Location,State,Submit Date,Decision Date,Case Status
2023,TechCorp Inc,Software Engineer,Senior,95000,New York,NY,20230115,20230301,Approved
2023,DataCorp LLC,Data Analyst,Junior,75000,San Francisco,CA,20230120,20230315,Pending
2023,StartupXYZ,Frontend Developer,Mid-Level,85000,Austin,TX,20230125,20230320,Denied
```

## Clear PERM Data Script

### Usage
```bash
cd server
node scripts/clearPermData.js
```

This script will:
- Count existing PERM records
- Delete all records from the PermReports table
- Provide confirmation messages

## Examples

### Upload PERM data with default settings
```bash
node scripts/uploadPermData.js ./data/perm_2023.csv
```

### Upload large file with smaller batches
```bash
node scripts/uploadPermData.js ./data/large_perm_data.csv --batch-size=100
```

### Clear existing data and upload fresh data
```bash
node scripts/clearPermData.js
node scripts/uploadPermData.js ./data/perm_data.csv
```

### Upload and fail on any duplicate
```bash
node scripts/uploadPermData.js ./data/perm_data.csv --skip-duplicates=false
``` 