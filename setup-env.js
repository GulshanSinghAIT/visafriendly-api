#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Setup script for environment configuration
 * This script helps set up the required environment variables
 */

console.log('🚀 VisaFriendly Environment Setup');
console.log('================================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envExists = fs.existsSync(envPath);

if (!envExists) {
  console.log('📝 Creating .env file...');
  
  const envTemplate = `# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=visafriendly
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# Dodo Payments Configuration (Optional for development)
# Get your API key from: https://dodopayments.com
DODO_PAYMENTS_API_KEY=your_dodo_payments_api_key_here
DODO_WEBHOOK_SECRET=your_webhook_secret_here

# Application URLs
CLIENT_URL=http://localhost:3000
SERVER_URL=http://localhost:5000

# Environment
NODE_ENV=development

# Server Configuration
PORT=5000

# JWT Secret (if using JWT authentication)
JWT_SECRET=your_jwt_secret_here

# Frontend API URL
REACT_APP_API_URL=http://localhost:5000
`;

  fs.writeFileSync(envPath, envTemplate);
  console.log('✅ .env file created successfully!');
  console.log('📝 Please edit the .env file with your actual values.\n');
} else {
  console.log('✅ .env file already exists');
}

// Load environment variables
require('dotenv').config();

console.log('🔍 Checking environment configuration...\n');

// Check required environment variables
const requiredVars = [
  'DB_HOST',
  'DB_PORT', 
  'DB_NAME',
  'DB_USER',
  'DB_PASSWORD'
];

const optionalVars = [
  'DODO_PAYMENTS_API_KEY',
  'DODO_WEBHOOK_SECRET',
  'CLIENT_URL',
  'SERVER_URL',
  'NODE_ENV',
  'PORT',
  'JWT_SECRET',
  'REACT_APP_API_URL'
];

console.log('📋 Required Environment Variables:');
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value && value !== 'your_db_user' && value !== 'your_db_password') {
    console.log(`  ✅ ${varName}: ${value}`);
  } else {
    console.log(`  ❌ ${varName}: Not configured`);
  }
});

console.log('\n📋 Optional Environment Variables:');
optionalVars.forEach(varName => {
  const value = process.env[varName];
  if (value && !value.includes('your_')) {
    console.log(`  ✅ ${varName}: ${varName.includes('SECRET') || varName.includes('KEY') ? '***' : value}`);
  } else {
    console.log(`  ⚠️  ${varName}: Not configured (optional)`);
  }
});

console.log('\n🔧 Dodo Payments Configuration:');
const dodoApiKey = process.env.DODO_PAYMENTS_API_KEY;
if (dodoApiKey && dodoApiKey !== 'your_dodo_payments_api_key_here') {
  console.log('  ✅ Dodo Payments API key is configured');
  console.log('  💳 Payment processing will work normally');
} else {
  console.log('  ⚠️  Dodo Payments API key not configured');
  console.log('  🔧 Application will use mock payment processing');
  console.log('  📝 To enable real payments, get an API key from: https://dodopayments.com');
}

console.log('\n📚 Next Steps:');
console.log('1. Edit the .env file with your actual database credentials');
console.log('2. (Optional) Add your Dodo Payments API key for real payment processing');
console.log('3. Run "npm start" to start the server');
console.log('4. Run "npm test" to test the payment integration');

console.log('\n�� Setup complete!'); 