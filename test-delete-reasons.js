const { sequelize } = require('./src/db/models/index');
const DeleteReasons = require('./src/db/models/deleteReasons');

async function testDeleteReasons() {
  try {
    console.log('🔗 Testing database connection...');
    await sequelize.authenticate();
    console.log('✅ Database connection successful');

    console.log('\n📋 Checking if DeleteReasons table exists...');
    
    // Check if table exists
    const tableExists = await sequelize.getQueryInterface().showAllTables();
    console.log('Available tables:', tableExists);
    
    if (tableExists.includes('DeleteReasons')) {
      console.log('✅ DeleteReasons table exists');
      
      // Try to count records
      const count = await DeleteReasons.count();
      console.log(`📊 Current DeleteReasons count: ${count}`);
      
      // Try to create a test record
      console.log('\n🧪 Testing record creation...');
      const testRecord = await DeleteReasons.create({
        userId: 999,
        email: 'test@example.com',
        reason: 'Test reason',
        category: 'OTHER',
        additionalFeedback: 'Test feedback',
        deletedAt: new Date()
      });
      
      console.log('✅ Test record created successfully:', testRecord.id);
      
      // Clean up test record
      await testRecord.destroy({ force: true });
      console.log('🧹 Test record cleaned up');
      
    } else {
      console.log('❌ DeleteReasons table does not exist');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    await sequelize.close();
    console.log('🔒 Database connection closed');
  }
}

testDeleteReasons(); 