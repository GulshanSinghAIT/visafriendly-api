require('dotenv').config();
const { Sequelize } = require('sequelize');

// Test both development and production configurations
const configs = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    dialectOptions: {
      ssl: false
    }
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};

async function testConnection(env) {
  console.log(`\n🔍 Testing ${env} configuration...`);
  
  const config = configs[env];
  if (!config) {
    console.error(`❌ No configuration found for ${env}`);
    return;
  }
  
  console.log(`📊 Database: ${config.database}`);
  console.log(`🌐 Host: ${config.host}:${config.port}`);
  console.log(`👤 User: ${config.username}`);
  console.log(`🔒 SSL: ${config.dialectOptions?.ssl ? 'Enabled' : 'Disabled'}`);
  
  const sequelize = new Sequelize(config);
  
  try {
    await sequelize.authenticate();
    console.log(`✅ ${env} connection successful!`);
    return true;
  } catch (error) {
    console.error(`❌ ${env} connection failed:`, error.message);
    console.error(`🔧 Error details:`, error);
    return false;
  } finally {
    await sequelize.close();
  }
}

async function runTests() {
  console.log('🚀 Starting database connection tests...\n');
  
  const results = {};
  
  // Test development config
  results.development = await testConnection('development');
  
  // Test production config
  results.production = await testConnection('production');
  
  console.log('\n📋 Test Results:');
  console.log(`Development: ${results.development ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Production: ${results.production ? '✅ PASS' : '❌ FAIL'}`);
  
  if (!results.development && !results.production) {
    console.log('\n⚠️  Both configurations failed. Please check your environment variables:');
    console.log('Required variables: DB_USER, DB_PASS, DB_NAME, DB_HOST, DB_PORT');
    process.exit(1);
  }
  
  console.log('\n✅ Tests completed!');
}

runTests().catch(console.error); 