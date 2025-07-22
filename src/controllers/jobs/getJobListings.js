const { job } = require("../../db/models");
const { User } = require("../../db/models");
const { CurrentPlans } = require("../../db/models");
// const { DailySearch } = require("../../db/models"); // Temporarily commented out
const { Op } = require("sequelize");

// Debug: Log all available models
const models = require("../../db/models");
console.log("Available models:", Object.keys(models));
// console.log("DailySearch model:", DailySearch);

const getJobListings = async (req, res) => {
  try {
    const { email, page = 1, limit = 15, filters = {} } = req.query;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    // Parse filters if it's a string
    let parsedFilters = filters;
    if (typeof filters === 'string') {
      try {
        parsedFilters = JSON.parse(filters);
      } catch (error) {
        console.error("Error parsing filters:", error);
        parsedFilters = {};
      }
    }

    console.log("Received filters:", parsedFilters);

    // Get user and their plan
    const user = await User.findOne({
      where: { email },
      include: [{
        model: CurrentPlans,
        as: 'CurrentPlan'
      }]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const currentPlanId = user.currentPlanId;
    const isPaidUser = currentPlanId > 1; // Plans 2, 3, 4 are paid plans
    
    // Temporary daily search tracking using a simple approach
    let dailySearchCount = 0;
    if (!isPaidUser) {
      // For now, we'll use a simple in-memory approach until we fix the DailySearch model
      // In production, you should implement proper database tracking
      const today = new Date().toISOString().split('T')[0];
      const searchKey = `${email}_${today}`;
      
      // This is a temporary solution - in production, use the database
      if (!global.dailySearchCounts) {
        global.dailySearchCounts = {};
      }
      
      if (!global.dailySearchCounts[searchKey]) {
        global.dailySearchCounts[searchKey] = 0;
      }
      
      dailySearchCount = global.dailySearchCounts[searchKey];
      
      // Check if user has exceeded daily limit
      if (dailySearchCount >= 5) {
        return res.status(403).json({
          success: false,
          message: "You have reached your daily limit of 5 job searches. Please upgrade to continue or try again tomorrow.",
          limitReached: true,
          dailySearchCount: dailySearchCount
        });
      }
      
      // Increment search count for this request
      global.dailySearchCounts[searchKey] = dailySearchCount + 1;
      dailySearchCount = global.dailySearchCounts[searchKey];
    }

    // Build where clause for filters
    const whereClause = {};
    
    if (parsedFilters.jobCategory) {
      whereClause.jobTitle = {
        [Op.iLike]: `%${parsedFilters.jobCategory}%`
      };
    }
    
    if (parsedFilters.jobType) {
      whereClause.jobType = parsedFilters.jobType;
    }
    
    if (parsedFilters.workSetting) {
      whereClause.workSetting = parsedFilters.workSetting;
    }
    
    if (parsedFilters.sponsorType) {
      whereClause.sponsorType = parsedFilters.sponsorType;
    }
    
    if (parsedFilters.startupJob) {
      whereClause.startupJob = parsedFilters.startupJob;
    }
    
    if (parsedFilters.minSalary) {
      whereClause.minSalary = {
        [Op.gte]: parseFloat(parsedFilters.minSalary)
      };
    }
    
    if (parsedFilters.maxSalary) {
      whereClause.maxSalary = {
        [Op.lte]: parseFloat(parsedFilters.maxSalary)
      };
    }
    
    if (parsedFilters.location) {
      whereClause.location = {
        [Op.iLike]: `%${parsedFilters.location}%`
      };
    }
    
    if (parsedFilters.skills) {
      whereClause.skills = {
        [Op.iLike]: `%${parsedFilters.skills}%`
      };
    }

    // Add experience filter
    if (parsedFilters.minExperience) {
      whereClause.yearsOfExperience = {
        [Op.gte]: parseInt(parsedFilters.minExperience)
      };
    }
    
    if (parsedFilters.maxExperience) {
      if (whereClause.yearsOfExperience) {
        whereClause.yearsOfExperience[Op.lte] = parseInt(parsedFilters.maxExperience);
      } else {
        whereClause.yearsOfExperience = {
          [Op.lte]: parseInt(parsedFilters.maxExperience)
        };
      }
    }

    console.log("Where clause:", whereClause);

    // Pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    // Get total count for pagination
    const totalJobs = await job.count({ where: whereClause });
    const totalPages = Math.ceil(totalJobs / parseInt(limit));
    
    // Get jobs with pagination
    const jobs = await job.findAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: offset,
      order: [['createdAt', 'DESC']]
    });

    console.log(`Found ${jobs.length} jobs out of ${totalJobs} total`);

    // Transform jobs to match frontend expectations
    const transformedJobs = jobs.map(job => ({
      jId: job.id,
      title: job.jobTitle,
      company: job.companyName,
      location: job.location,
      exp: job.yearsOfExperience,
      salary: job.minSalary,
      date: job.jobPostingDate,
      workSetting: job.workSetting,
      jobType: job.jobType,
      skills: job.skills,
      jobDescription: job.jobDescription,
      smallDescription: job.smallDescription,
      responsibilities: job.responsibilities,
      applyUrl: job.applyUrl,
      companyLogo: job.companyLogo,
      visaSponsoring: job.visaSponsoring,
      sponsorType: job.sponsorType,
      startupJob: job.startupJob,
      minSalary: job.minSalary,
      maxSalary: job.maxSalary,
      tags: job.tags
    }));

    res.json({
      success: true,
      jobs: transformedJobs,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalJobs,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      userPlan: {
        currentPlanId,
        isPaidUser,
        searchLimit: isPaidUser ? 'unlimited' : 5,
        dailySearchCount: dailySearchCount
      }
    });

  } catch (error) {
    console.error("Error fetching job listings:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

module.exports = { getJobListings }; 