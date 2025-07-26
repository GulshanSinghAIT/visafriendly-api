const { job } = require("../../db/models");
const { Op } = require("sequelize");

const getPublicJobListings = async (req, res) => {
  try {
    const { page = 1, limit = 15, filters = {}, isNewSearch = false } = req.query;
    
    console.log("Public job listings request:", { page, limit, filters, isNewSearch });

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
      id: job.id,
      jobTitle: job.jobTitle,
      companyName: job.companyName,
      location: job.location,
      yearsOfExperience: job.yearsOfExperience,
      minSalary: job.minSalary,
      maxSalary: job.maxSalary,
      jobPostingDate: job.jobPostingDate,
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
      jobCategory: job.jobCategory,
      tags: job.tags,
      // Add formatted fields for display
      experience: job.yearsOfExperience ? `${job.yearsOfExperience}+ years exp` : "Not specified",
      salary: job.minSalary ? `$${job.minSalary.toLocaleString()}/year` : "Not specified",
      postedDate: job.jobPostingDate ? getTimeAgo(job.jobPostingDate) : "Recently",
      applicants: "24 Applicants" // Placeholder
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
      }
    });

  } catch (error) {
    console.error("Error fetching public job listings:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Helper function to format date as "time ago"
function getTimeAgo(date) {
  const now = new Date();
  const jobDate = new Date(date);
  const diffInMs = now - jobDate;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "1 day ago";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
}

module.exports = { getPublicJobListings }; 