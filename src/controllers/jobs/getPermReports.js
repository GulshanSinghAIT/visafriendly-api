const { Op } = require("sequelize");
const PermReport = require("../../db/models/permcase");

const getPermReports = async (req, res) => {
  try {
    const { 
      page = 1, 
      year, 
      company, 
      role,
      limit = 15 
    } = req.query;

    // Build where conditions
    const whereConditions = {};

    // Year filter
    if (year) {
      whereConditions.year = year;
    }

    // Company search filter (case-insensitive)
    if (company) {
      whereConditions.Employer = {
        [Op.iLike]: `%${company}%`
      };
    }

    // Role substring filter (case-insensitive)
    if (role) {
      whereConditions.jobTitle = {
        [Op.iLike]: `%${role}%`
      };
    }

    // Calculate pagination
    const offset = (page - 1) * limit;

    // Get total count for pagination
    const totalCount = await PermReport.count({
      where: whereConditions
    });

    // Fetch paginated results
    const permReports = await PermReport.findAll({
      where: whereConditions,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']], // Latest first
      attributes: [
        'Id',
        'year',
        'Employer',
        'jobTitle',
        'experienceLevel',
        'baseSalary',
        'Location',
        'submitDate',
        'decisionDate',
        'caseStatus',
        'createdAt'
      ]
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return res.status(200).json({
      success: true,
      data: permReports,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
        limit: parseInt(limit)
      },
      filters: {
        year: year || null,
        company: company || null,
        role: role || null
      }
    });

  } catch (error) {
    console.error("Error fetching PERM reports:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};

// Get unique years for filter dropdown
const getAvailableYears = async (req, res) => {
  try {
    const years = await PermReport.findAll({
      attributes: ['year'],
      group: ['year'],
      order: [['year', 'DESC']]
    });

    const yearList = years.map(item => item.year);

    return res.status(200).json({
      success: true,
      years: yearList
    });

  } catch (error) {
    console.error("Error fetching available years:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};

// Get PERM statistics
const getPermStats = async (req, res) => {
  try {
    const stats = await PermReport.findOne({
      attributes: [
        [PermReport.sequelize.fn('COUNT', PermReport.sequelize.col('Id')), 'totalCases'],
        [PermReport.sequelize.fn('COUNT', PermReport.sequelize.fn('DISTINCT', PermReport.sequelize.col('Employer'))), 'uniqueEmployers'],
        [PermReport.sequelize.fn('COUNT', PermReport.sequelize.fn('DISTINCT', PermReport.sequelize.col('year'))), 'yearsOfData'],
        [PermReport.sequelize.fn('AVG', PermReport.sequelize.col('baseSalary')), 'averageSalary']
      ],
      raw: true
    });

    return res.status(200).json({
      success: true,
      stats: {
        totalCases: parseInt(stats.totalCases),
        uniqueEmployers: parseInt(stats.uniqueEmployers),
        yearsOfData: parseInt(stats.yearsOfData),
        averageSalary: Math.round(parseFloat(stats.averageSalary) || 0)
      }
    });

  } catch (error) {
    console.error("Error fetching PERM statistics:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};

module.exports = {
  getPermReports,
  getAvailableYears,
  getPermStats
}; 