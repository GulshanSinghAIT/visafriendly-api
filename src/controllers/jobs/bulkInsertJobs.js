const { job } = require("../../db/models");

const bulkInsertJobs = async (req, res) => {
  try {
    const { jobs } = req.body;
    
    if (!jobs || !Array.isArray(jobs)) {
      return res.status(400).json({
        success: false,
        message: "Jobs array is required"
      });
    }

    // Transform the jobs data to match our database schema
    const transformedJobs = jobs.map(jobData => ({
      companyName: jobData.company_name || jobData.company,
      jobTitle: jobData.job_title || jobData.title,
      yearsOfExperience: parseInt(jobData.years_of_experience) || 0,
      minExperience: jobData.min_experience || '',
      location: jobData.location,
      jobType: jobData.Job_Type || jobData.jobType || 'Full-Time',
      workSetting: jobData.work_setting || jobData.workSetting || 'Onsite',
      minSalary: jobData.min_salary ? parseFloat(jobData.min_salary) : null,
      maxSalary: jobData.max_salary ? parseFloat(jobData.max_salary) : null,
      startupJob: jobData.startup_job === 'Yes' ? 'Yes' : 'No',
      jobPostingDate: new Date(jobData.job_posting_date || jobData.date || Date.now()),
      visaSponsoring: jobData.visa_sponsoring === 'true' || jobData.visaSponsoring === true,
      sponsorType: jobData.sponsor_type || jobData.h1Type || 'Regular H-1B',
      applyUrl: jobData.apply_url || jobData.applyLink || '',
      responsibilities: jobData.Responsibilities_and_Requirements || jobData.responsibility || '',
      companyLogo: jobData.Company_Logo || jobData.logo || '',
      jobDescription: jobData.job_description || jobData.fullDesc || '',
      smallDescription: jobData.Job_Description || jobData.smallDesc || '',
      skills: jobData.keywords_formatted || jobData.skills || '',
      tags: jobData.tags || ''
    }));

    // Insert jobs in batches to avoid memory issues
    const batchSize = 100;
    const results = [];
    
    for (let i = 0; i < transformedJobs.length; i += batchSize) {
      const batch = transformedJobs.slice(i, i + batchSize);
      const batchResults = await job.bulkCreate(batch, {
        ignoreDuplicates: true,
        returning: true
      });
      results.push(...batchResults);
    }

    res.json({
      success: true,
      message: `Successfully inserted ${results.length} jobs`,
      insertedCount: results.length,
      totalJobs: transformedJobs.length
    });

  } catch (error) {
    console.error("Error bulk inserting jobs:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

const clearAllJobs = async (req, res) => {
  try {
    const deletedCount = await job.destroy({
      where: {},
      truncate: true
    });

    res.json({
      success: true,
      message: "All jobs cleared successfully",
      deletedCount
    });

  } catch (error) {
    console.error("Error clearing jobs:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

module.exports = { bulkInsertJobs, clearAllJobs }; 