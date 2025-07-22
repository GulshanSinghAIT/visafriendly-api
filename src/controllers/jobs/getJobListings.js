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
    
    // Temporarily disable daily search tracking until model is fixed
    let dailySearchCount = 0;
    /*
    if (!isPaidUser) {
      const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
      
      // Find or create daily search record for today
      let dailySearch = await DailySearch.findOne({
        where: {
          email: email,
          searchDate: today
        }
      });
      
      if (!dailySearch) {
        // Create new record for today
        dailySearch = await DailySearch.create({
          email: email,
          searchDate: today,
          searchCount: 0
        });
      }
      
      dailySearchCount = dailySearch.searchCount;
      
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
      await dailySearch.increment('searchCount');
      dailySearchCount = dailySearch.searchCount + 1; // +1 because we just incremented
    }
    */

    // Build where clause for filters
    const whereClause = {};
    
    if (filters.jobCategory) {
      whereClause.jobTitle = {
        [Op.iLike]: `%${filters.jobCategory}%`
      };
    }
    
    if (filters.jobType) {
      whereClause.jobType = filters.jobType;
    }
    
    if (filters.workSetting) {
      whereClause.workSetting = filters.workSetting;
    }
    
    if (filters.sponsorType) {
      whereClause.sponsorType = filters.sponsorType;
    }
    
    if (filters.startupJob) {
      whereClause.startupJob = filters.startupJob;
    }
    
    if (filters.minSalary) {
      whereClause.minSalary = {
        [Op.gte]: parseFloat(filters.minSalary)
      };
    }
    
    if (filters.maxSalary) {
      whereClause.maxSalary = {
        [Op.lte]: parseFloat(filters.maxSalary)
      };
    }
    
    if (filters.location) {
      whereClause.location = {
        [Op.iLike]: `%${filters.location}%`
      };
    }
    
    if (filters.skills) {
      whereClause.skills = {
        [Op.iLike]: `%${filters.skills}%`
      };
    }

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
        dailySearchCount: dailySearchCount // Will be 0 until model is fixed
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