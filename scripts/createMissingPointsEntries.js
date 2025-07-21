const User = require('../src/db/models/user');
const { sequelize } = require('../src/db/models/index');

async function createMissingPointsEntries() {
  try {
    console.log('🔍 Finding users without points table entries...');
    
    // Find all users
    const allUsers = await User.findAll({
      attributes: ['id', 'email', 'firstName', 'lastName']
    });

    console.log(`Found ${allUsers.length} total users`);

    // Check which users don't have points table entries
    const usersWithoutPoints = [];
    
    for (const user of allUsers) {
      const pointsEntry = await sequelize.query(
        'SELECT * FROM "pointsTables" WHERE "userId" = ?',
        {
          replacements: [user.id],
          type: sequelize.QueryTypes.SELECT
        }
      );
      
      if (pointsEntry.length === 0) {
        usersWithoutPoints.push(user);
      }
    }

    console.log(`Found ${usersWithoutPoints.length} users without points table entries`);

    if (usersWithoutPoints.length === 0) {
      console.log('✅ All users already have points table entries!');
      return;
    }

    // Create points table entries for missing users
    for (const user of usersWithoutPoints) {
      try {
        await sequelize.query(
          'INSERT INTO "pointsTables" ("referals_accepted","total_points","userId","createdAt","updatedAt") values (0,0,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)',
          {
            replacements: [user.id],
            type: sequelize.QueryTypes.INSERT
          }
        );
        console.log(`✅ Created points entry for user ${user.email} (ID: ${user.id})`);
      } catch (error) {
        console.error(`❌ Failed to create points entry for user ${user.email}:`, error.message);
      }
    }

    console.log('🎉 Points table entries creation completed!');
  } catch (error) {
    console.error('❌ Error creating points entries:', error);
  } finally {
    await sequelize.close();
  }
}

createMissingPointsEntries(); 