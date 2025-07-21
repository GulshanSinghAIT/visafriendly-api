const { validateReferralCode } = require('../src/utils/referralCodeGenerator');
const User = require('../src/db/models/user');
const { sequelize } = require('../src/db/models/index');

async function debugReferralCode() {
  try {
    console.log('🔍 Debugging referral code: 061WDO');
    
    // Check if the referral code exists
    const user = await User.findOne({
      where: { referralCode: '061WDO' }
    });

    if (user) {
      console.log('✅ User found with referral code 061WDO:');
      console.log(`   - User ID: ${user.id}`);
      console.log(`   - Email: ${user.email}`);
      console.log(`   - Name: ${user.firstName} ${user.lastName}`);
      
      // Check their current points
      const pointsResult = await sequelize.query(
        'SELECT * FROM "pointsTables" WHERE "userId" = ?',
        {
          replacements: [user.id],
          type: sequelize.QueryTypes.SELECT
        }
      );
      
      if (pointsResult.length > 0) {
        console.log(`   - Current points: ${pointsResult[0].total_points}`);
        console.log(`   - Referrals accepted: ${pointsResult[0].referals_accepted}`);
      } else {
        console.log('   - No points table entry found');
      }
    } else {
      console.log('❌ No user found with referral code 061WDO');
      
      // List all referral codes in the system
      const allUsers = await User.findAll({
        where: { referralCode: { [sequelize.Op.not]: null } },
        attributes: ['id', 'email', 'referralCode']
      });
      
      console.log('\n📋 All referral codes in system:');
      allUsers.forEach(u => {
        console.log(`   - ${u.referralCode} (${u.email})`);
      });
    }

    // Test the validation function
    console.log('\n🧪 Testing validation function...');
    const validatedUser = await validateReferralCode('061WDO');
    if (validatedUser) {
      console.log('✅ Validation function works - user found');
    } else {
      console.log('❌ Validation function failed - user not found');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sequelize.close();
  }
}

debugReferralCode(); 