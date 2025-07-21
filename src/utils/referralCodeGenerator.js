const User = require("../db/models/user");

/**
 * Generates a unique referral code for a user
 * @param {number} userId - The user's ID to include in the code
 * @returns {Promise<string>} A unique referral code
 */
const generateReferralCode = async (userId) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code;
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 10;

  while (!isUnique && attempts < maxAttempts) {
    // Generate a 6-character code with user ID embedded
    const userIdStr = userId.toString().padStart(3, '0');
    const randomChars = Array.from({ length: 3 }, () => 
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('');
    
    code = userIdStr + randomChars;

    // Check if this code already exists
    const existingUser = await User.findOne({
      where: { referralCode: code }
    });

    if (!existingUser) {
      isUnique = true;
    } else {
      attempts++;
    }
  }

  if (!isUnique) {
    throw new Error('Unable to generate unique referral code after maximum attempts');
  }

  return code;
};

/**
 * Validates a referral code and returns the referring user
 * @param {string} referralCode - The referral code to validate
 * @returns {Promise<Object|null>} The referring user object or null if invalid
 */
const validateReferralCode = async (referralCode) => {
  if (!referralCode || typeof referralCode !== 'string') {
    return null;
  }

  const referringUser = await User.findOne({
    where: { referralCode: referralCode.trim().toUpperCase() }
  });

  return referringUser;
};

module.exports = {
  generateReferralCode,
  validateReferralCode
}; 