const { generateReferralCode } = require('../src/utils/referralCodeGenerator');
const User = require('../src/db/models/user');
const { sequelize } = require('../src/db/models/index');

async function generateReferralCodesForExistingUsers() {
  try {
    console.log('🔍 Finding users without referral codes...');
    
    // Find all users without referral codes
    const usersWithoutReferralCodes = await User.findAll({
      where: {
        referralCode: null
      }
    });

    console.log(`Found ${usersWithoutReferralCodes.length} users without referral codes`);

    if (usersWithoutReferralCodes.length === 0) {
      console.log('✅ All users already have referral codes!');
      return;
    }

    // Generate referral codes for each user
    for (const user of usersWithoutReferralCodes) {
      try {
        const referralCode = await generateReferralCode(user.id);
        await user.update({ referralCode });
        console.log(`✅ Generated referral code ${referralCode} for user ${user.email} (ID: ${user.id})`);
      } catch (error) {
        console.error(`❌ Failed to generate referral code for user ${user.email}:`, error.message);
      }
    }

    console.log('🎉 Referral code generation completed!');
  } catch (error) {
    console.error('❌ Error generating referral codes:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the script
generateReferralCodesForExistingUsers(); 