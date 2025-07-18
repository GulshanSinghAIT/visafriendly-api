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

// Environment validation and setup
require('dotenv').config();

console.log('\n=== Environment Configuration Check ===');

// Required environment variables
const requiredVars = [
  'NODE_ENV',
  'PORT'
];

// Database configuration
const dbVars = [
  'DB_HOST',
  'DB_PORT',
  'DB_NAME',
  'DB_USER',
  'DB_PASSWORD'
];

// Optional but recommended
const optionalVars = [
  'CLIENT_URL',
  'FRONTEND_URL',
  'EMAIL_SERVICE_CONFIG',
  'DODO_PAYMENTS_CONFIG'
];

console.log('Current Environment:', process.env.NODE_ENV || 'development');
console.log('Port:', process.env.PORT || '5000');

// Check required variables
console.log('\n--- Required Variables ---');
requiredVars.forEach(varName => {
  const value = process.env[varName];
  console.log(`${varName}: ${value ? '✓ Set' : '✗ Missing'}`);
});

// Check database variables
console.log('\n--- Database Configuration ---');
dbVars.forEach(varName => {
  const value = process.env[varName];
  if (varName === 'DB_PASSWORD') {
    console.log(`${varName}: ${value ? '✓ Set (hidden)' : '✗ Missing'}`);
  } else {
    console.log(`${varName}: ${value || '✗ Missing'}`);
  }
});

// Check optional variables
console.log('\n--- Optional Configuration ---');
optionalVars.forEach(varName => {
  const value = process.env[varName];
  console.log(`${varName}: ${value || 'Not set'}`);
});

// CORS Origins Check
console.log('\n--- CORS Configuration ---');
const corsOrigins = [
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL
].filter(Boolean);

if (corsOrigins.length > 0) {
  console.log('Configured CORS origins:');
  corsOrigins.forEach(origin => console.log(`  - ${origin}`));
} else {
  console.log('⚠️  No CORS origins configured - will allow localhost only');
}

// Validation warnings
console.log('\n--- Validation Summary ---');
const missingRequired = requiredVars.filter(varName => !process.env[varName]);
const missingDb = dbVars.filter(varName => !process.env[varName]);

if (missingRequired.length > 0) {
  console.log('⚠️  Missing required variables:', missingRequired.join(', '));
}

if (missingDb.length > 0) {
  console.log('⚠️  Missing database variables:', missingDb.join(', '));
}

if (!process.env.CLIENT_URL && !process.env.FRONTEND_URL) {
  console.log('⚠️  No frontend URL configured - CORS might block requests');
}

if (missingRequired.length === 0 && missingDb.length === 0) {
  console.log('✅ All required environment variables are configured');
}

console.log('\n=== Environment Check Complete ===\n');

module.exports = {
  isConfigured: missingRequired.length === 0 && missingDb.length === 0,
  missingRequired,
  missingDb,
  corsOrigins
}; 