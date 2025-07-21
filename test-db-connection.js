require('dotenv').config();
const { Sequelize } = require('sequelize');

console.log('Testing database connection...');
console.log('Environment:', process.env.NODE_ENV || 'development');

// Log environment variables (without sensitive data)
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASS:', process.env.DB_PASS ? '[SET]' : '[NOT SET]');

// Create Sequelize instance
const sequelize = new Sequelize({
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false
    } : false
  },
  logging: console.log
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection successful!');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await sequelize.close();
  }
}

testConnection(); 