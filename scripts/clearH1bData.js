const db = require('../src/db/models');
const H1bSponsorCase = db.H1bSponsorCase;
const sequelize = require('../src/config/database');

/**
 * Clear all H1B sponsor case data from the database
 */
async function clearH1bData() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('🔗 Database connection established successfully.');

    // Count existing records
    const count = await H1bSponsorCase.count();
    console.log(`📊 Found ${count} existing H1B records`);

    if (count === 0) {
      console.log('✅ No records to clear.');
      return;
    }

    // Confirm deletion
    console.log('⚠️  This will DELETE ALL H1B sponsor case records!');
    
    // Clear all records
    await H1bSponsorCase.destroy({
      where: {},
      truncate: true // This is more efficient for clearing all data
    });

    console.log('🗑️  All H1B sponsor case records have been cleared.');
    console.log('✅ You can now re-upload your CSV file with all records.');

  } catch (error) {
    console.error('❌ Error clearing H1B data:', error);
    throw error;
  } finally {
    // Close database connection
    await sequelize.close();
    console.log('🔒 Database connection closed.');
  }
}

// Run the script if called directly
if (require.main === module) {
  clearH1bData();
}

module.exports = { clearH1bData }; 