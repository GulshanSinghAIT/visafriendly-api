const { UserLogin } = require('../../db/models');
const { Op } = require('sequelize');

// Record a login for a user (called on successful login)
const recordLogin = async (req, res) => {
  try {
    const { email } = req.body;
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check if login already recorded for today
    const existingLogin = await UserLogin.findOne({
      where: {
        userEmail: email,
        loginDate: today
      }
    });

    if (existingLogin) {
      return res.status(200).json({
        success: true,
        message: 'Login already recorded for today'
      });
    }

    // Create new login record
    await UserLogin.create({
      userEmail: email,
      loginDate: today
    });

    res.status(201).json({
      success: true,
      message: 'Login recorded successfully'
    });
  } catch (error) {
    console.error('Error recording login:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record login',
      error: error.message
    });
  }
};

// Get login dates for a specific month
const getLoginDatesForMonth = async (req, res) => {
  try {
    const { email } = req.params;
    const { year, month } = req.query;

    if (!email || !year || !month) {
      return res.status(400).json({
        success: false,
        message: 'email, year, and month are required'
      });
    }

    // Create date range for the month
    const startDate = `${year}-${month.padStart(2, '0')}-01`;
    const endDate = new Date(year, month, 0).toISOString().split('T')[0]; // Last day of month

    const loginRecords = await UserLogin.findAll({
      where: {
        userEmail: email,
        loginDate: {
          [Op.between]: [startDate, endDate]
        }
      },
      attributes: ['loginDate'],
      order: [['loginDate', 'ASC']]
    });

    // Extract day numbers from login dates
    const loginDays = loginRecords.map(record => {
      const date = new Date(record.loginDate);
      return date.getDate(); // Returns day of month (1-31)
    });

    res.status(200).json({
      success: true,
      data: loginDays
    });
  } catch (error) {
    console.error('Error fetching login dates:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch login dates',
      error: error.message
    });
  }
};

// Get current streak information
const getCurrentStreak = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'email is required'
      });
    }

    const today = new Date().toISOString().split('T')[0];
    
    // Get all login dates for the user, ordered by date descending
    const loginRecords = await UserLogin.findAll({
      where: { userEmail: email },
      attributes: ['loginDate'],
      order: [['loginDate', 'DESC']]
    });

    const loginDates = loginRecords.map(record => record.loginDate);

    // Calculate current streak
    let currentStreak = 0;
    let currentDate = new Date(today);
    
    for (const loginDate of loginDates) {
      const loginDateObj = new Date(loginDate);
      const diffTime = currentDate - loginDateObj;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 1) {
        currentStreak++;
        currentDate = loginDateObj;
      } else {
        break;
      }
    }

    // Calculate highest streak
    let highestStreak = 0;
    let tempStreak = 0;
    let prevDate = null;

    for (let i = 0; i < loginDates.length; i++) {
      const currentDate = new Date(loginDates[i]);
      
      if (prevDate) {
        const diffTime = prevDate - currentDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          tempStreak++;
        } else {
          highestStreak = Math.max(highestStreak, tempStreak);
          tempStreak = 1;
        }
      } else {
        tempStreak = 1;
      }
      
      prevDate = currentDate;
    }
    
    highestStreak = Math.max(highestStreak, tempStreak);

    res.status(200).json({
      success: true,
      data: {
        currentStreak,
        highestStreak
      }
    });
  } catch (error) {
    console.error('Error calculating streak:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate streak',
      error: error.message
    });
  }
};

module.exports = {
  recordLogin,
  getLoginDatesForMonth,
  getCurrentStreak
}; 