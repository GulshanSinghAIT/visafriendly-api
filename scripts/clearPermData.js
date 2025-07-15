const db = require('../src/db/models');
const PermReport = db.PermReport;
const sequelize = require('../src/config/database');

/**
 * Clear all PERM report data from the database
 */
async function clearPermData() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('🔗 Database connection established successfully.');

    // Count existing records
    const count = await PermReport.count();
    console.log(`📊 Found ${count} existing PERM records`);

    if (count === 0) {
      console.log('✅ No records to clear.');
      return;
    }

    // Confirm deletion
    console.log('⚠️  This will DELETE ALL PERM report records!');
    
    // Clear all records
    await PermReport.destroy({
      where: {},
      truncate: true // This is more efficient for clearing all data
    });

    console.log('🗑️  All PERM report records have been cleared.');
    console.log('✅ You can now re-upload your CSV file with all records.');

  } catch (error) {
    console.error('❌ Error clearing PERM data:', error);
    throw error;
  } finally {
    // Close database connection
    await sequelize.close();
    console.log('🔒 Database connection closed.');
  }
}

// Run the script if called directly
if (require.main === module) {
  clearPermData();
}

module.exports = { clearPermData }; 