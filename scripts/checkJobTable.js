const { Sequelize } = require('sequelize');
const config = require('../src/config/config.cjs');

async function checkJobTable() {
  const sequelize = new Sequelize(config.production);
  
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');
    
    // Get table description
    const [results] = await sequelize.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'jobs' 
      ORDER BY ordinal_position;
    `);
    
    console.log('\nCurrent jobs table structure:');
    console.log('==============================');
    results.forEach(col => {
      console.log(`${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });
    
    // Check if table exists
    const [tableExists] = await sequelize.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'jobs'
      );
    `);
    
    console.log(`\nTable exists: ${tableExists[0].exists}`);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkJobTable(); 