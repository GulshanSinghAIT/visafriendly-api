const { job } = require("../../db/models");
const { User } = require("../../db/models");
const { CurrentPlans } = require("../../db/models");
const { Op } = require("sequelize");

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
    
    // Check if free user has exceeded their limit
    if (!isPaidUser) {
      // For free users, we'll implement a simple counter
      // In a production environment, you might want to track this in a separate table
      const userSearchCount = parseInt(req.query.searchCount || 0);
      
      if (userSearchCount >= 5) {
        return res.status(403).json({
          success: false,
          message: "You have reached your free plan limit of 5 job searches. Please upgrade to continue.",
          limitReached: true
        });
      }
    }

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
      whereClause.maxSalary = {
        [Op.gte]: parseFloat(filters.minSalary)
      };
    }
    
    if (filters.maxSalary) {
      whereClause.minSalary = {
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

    // Calculate pagination
    const offset = (page - 1) * limit;
    
    // Get total count for pagination
    const totalJobs = await job.count({ where: whereClause });
    const totalPages = Math.ceil(totalJobs / limit);

    // Get jobs with pagination
    const jobs = await job.findAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: offset,
      order: [['jobPostingDate', 'DESC']],
      attributes: [
        'id',
        'companyName',
        'jobTitle',
        'yearsOfExperience',
        'minExperience',
        'location',
        'jobType',
        'workSetting',
        'minSalary',
        'maxSalary',
        'startupJob',
        'jobPostingDate',
        'visaSponsoring',
        'sponsorType',
        'applyUrl',
        'responsibilities',
        'companyLogo',
        'jobDescription',
        'smallDescription',
        'skills',
        'tags'
      ]
    });

    // Transform data to match frontend expectations
    const transformedJobs = jobs.map((job, index) => ({
      jId: job.id,
      company: job.companyName,
      title: job.jobTitle,
      exp: job.yearsOfExperience || 0,
      location: job.location,
      type: job.jobType,
      workSetting: job.workSetting,
      salary: job.maxSalary,
      minSalary: job.minSalary,
      maxSalary: job.maxSalary,
      startupJob: job.startupJob,
      date: job.jobPostingDate,
      visaSponsoring: job.visaSponsoring,
      h1Type: job.sponsorType,
      applyLink: job.applyUrl,
      responsibility: job.responsibilities,
      logo: job.companyLogo,
      expText: job.minExperience,
      smallDesc: job.smallDescription,
      fullDesc: job.jobDescription,
      skills: job.skills,
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
        searchLimit: isPaidUser ? 'unlimited' : 5
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