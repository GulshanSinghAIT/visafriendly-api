#!/bin/bash

# Build script for Render deployment
echo "🚀 Starting Render deployment build..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run database migrations
echo "🗄️ Running database migrations..."
npx sequelize-cli db:migrate

# Run database seeders (optional)
echo "🌱 Running database seeders..."
npx sequelize-cli db:seed:all || echo "⚠️ No seeders found or seeding failed, continuing..."

echo "✅ Build completed successfully!" 