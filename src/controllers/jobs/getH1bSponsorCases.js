const { Op } = require("sequelize");
const H1bSponsorCase = require("../../db/models/h1bsponsorcase");

const getH1bSponsorCases = async (req, res) => {
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
      whereConditions.EmployerName = {
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
    const totalCount = await H1bSponsorCase.count({
      where: whereConditions
    });

    // Fetch paginated results
    const h1bCases = await H1bSponsorCase.findAll({
      where: whereConditions,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']], // Latest first
      attributes: [
        'caseId',
        'year',
        'EmployerName',
        'jobTitle',
        'experienceLevel',
        'baseSalary',
        'Location',
        'submitDate',
        'startDate',
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
      data: h1bCases,
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
    console.error("Error fetching H1B sponsor cases:", error);
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
    const years = await H1bSponsorCase.findAll({
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

// Get H1B statistics
const getH1bStats = async (req, res) => {
  try {
    const stats = await H1bSponsorCase.findOne({
      attributes: [
        [H1bSponsorCase.sequelize.fn('COUNT', H1bSponsorCase.sequelize.col('caseId')), 'totalCases'],
        [H1bSponsorCase.sequelize.fn('COUNT', H1bSponsorCase.sequelize.fn('DISTINCT', H1bSponsorCase.sequelize.col('EmployerName'))), 'uniqueEmployers'],
        [H1bSponsorCase.sequelize.fn('COUNT', H1bSponsorCase.sequelize.fn('DISTINCT', H1bSponsorCase.sequelize.col('year'))), 'yearsOfData'],
        [H1bSponsorCase.sequelize.fn('AVG', H1bSponsorCase.sequelize.col('baseSalary')), 'averageSalary']
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
    console.error("Error fetching H1B statistics:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};

module.exports = {
  getH1bSponsorCases,
  getAvailableYears,
  getH1bStats
}; 