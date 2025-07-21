const User = require("../../db/models/user");

const getUserReferralCode = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: "Email is required" 
      });
    }

    const user = await User.findOne({
      where: { email },
      attributes: ['id', 'referralCode', 'firstName', 'lastName']
    });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    if (!user.referralCode) {
      return res.status(404).json({ 
        success: false, 
        message: "Referral code not found for user" 
      });
    }

    const referralLink = `https://www.visafriendly.com?ref_code=${user.referralCode}`;

    return res.status(200).json({
      success: true,
      referralCode: user.referralCode,
      referralLink: referralLink,
      userName: `${user.firstName} ${user.lastName}`
    });
  } catch (error) {
    console.error("Error getting user referral code:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal Server Error" 
    });
  }
};

module.exports = {
  getUserReferralCode
}; 