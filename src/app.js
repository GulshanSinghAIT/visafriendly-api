const express = require("express");
const app = express();
const contactDetails = require("./routes/onboarding/contactDetails.js");
const educationRoutes = require("./routes/onboarding/education.js");
const main = require("./routes/profile/main.js");
const settingRoutes = require("./routes/settings/settingRoutes.js");
const savedAndApplied = require("./routes/jobs/savedAndApplied.js");
const jobListings = require("./routes/jobs/jobListings.js");
const testRoute = require("./routes/jobs/testRoute.js");
const h1bSponsorCases = require("./routes/jobs/h1bSponsorCases.js");
const permReports = require("./routes/jobs/permReports.js");
const referals = require("./routes/referals/referals.js");
const pricing = require("./routes/pricing/pricing.js");
const columnsAndDashBoard = require("./routes/dashboard/columnsAndDashboard.js");
const loginRoutes = require("./routes/dashboard/loginRoutes.js");
const linksRoutes = require("./routes/onboarding/links.js");

const cors = require("cors");

// Database connection and utilities
const sequelize = require("./config/database.js");
const { initializeDatabase, validateRequiredPlans } = require("./utils/databaseInit.js");

// Enhanced request logging middleware
app.use((req, res, next) => {
  console.log(`\n=== Incoming Request ===`);
  console.log(`${req.method} ${req.url}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Query:', JSON.stringify(req.query, null, 2));
  
  // Log body for POST/PUT requests (will be available after parsing)
  const originalSend = res.send;
  const originalJson = res.json;
  
  res.send = function(data) {
    console.log(`\n=== Response for ${req.method} ${req.url} ===`);
    console.log('Status:', res.statusCode);
    if (res.statusCode >= 400) {
      console.log('Error Response Body:', data);
    }
    return originalSend.call(this, data);
  };
  
  res.json = function(data) {
    console.log(`\n=== Response for ${req.method} ${req.url} ===`);
    console.log('Status:', res.statusCode);
    if (res.statusCode >= 400) {
      console.log('Error Response Body:', JSON.stringify(data, null, 2));
    }
    return originalJson.call(this, data);
  };
  
  next();
});

// Body parsing middleware (removed duplicates)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Log parsed body for debugging
app.use((req, res, next) => {
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Enhanced CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001', 
  'https://localhost:3000',
  'https://localhost:3001',
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
  // Add common Vercel/Netlify patterns
  /^https:\/\/.*\.vercel\.app$/,
  /^https:\/\/.*\.netlify\.app$/,
  /^https:\/\/.*\.render\.com$/
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      console.log('CORS Check - Origin:', origin);
      
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      
      // Check if origin is in allowed list
      const isAllowed = allowedOrigins.some(allowedOrigin => {
        if (typeof allowedOrigin === 'string') {
          return allowedOrigin === origin;
        } else if (allowedOrigin instanceof RegExp) {
          return allowedOrigin.test(origin);
        }
        return false;
      });
      
      if (isAllowed) {
        console.log('CORS Allowed for origin:', origin);
        callback(null, true);
      } else {
        console.log('CORS Blocked for origin:', origin);
        console.log('Allowed origins:', allowedOrigins);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    credentials: true,
    optionsSuccessStatus: 200
  })
);

// Preflight OPTIONS handler
app.options('*', (req, res) => {
  console.log('Preflight request for:', req.url);
  res.status(200).end();
});

// Database connection test endpoint
app.get("/health", async (req, res) => {
  try {
    await sequelize.authenticate();
    const planValidation = await validateRequiredPlans();
    
    res.json({ 
      status: "ok", 
      database: "connected",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      cors_origins: allowedOrigins.filter(o => typeof o === 'string'),
      plans: {
        valid: planValidation.isValid,
        existing: planValidation.existingPlans,
        missing: planValidation.missingPlans,
        total: planValidation.totalRequired
      }
    });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(500).json({ 
      status: "error", 
      database: "disconnected",
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Database initialization endpoint - seeds required data
app.post("/init-database", async (req, res) => {
  try {
    const results = await initializeDatabase();
    
    res.json({
      message: "Database initialization completed",
      timestamp: new Date().toISOString(),
      results
    });
    
  } catch (error) {
    console.error("Database initialization failed:", error);
    res.status(500).json({
      error: "Database initialization failed",
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Debug endpoint for troubleshooting
app.post("/debug", (req, res) => {
  res.json({
    message: "Debug endpoint working",
    method: req.method,
    headers: req.headers,
    body: req.body,
    query: req.query,
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use("/onboarding", contactDetails);
app.use("/onboarding/education", educationRoutes);
app.use("/profile", main);
app.use("/settings", settingRoutes);
app.use("/jobs", jobListings);
app.use("/jobs/test", testRoute);
app.use("/jobs/h1b-sponsor-cases", h1bSponsorCases);
app.use("/jobs/perm-reports", permReports);
app.use("/refer", referals);
app.use("/dashboard", columnsAndDashBoard);
app.use("/login", loginRoutes);
app.use("/pricing", pricing);
app.use("/onboarding/links", linksRoutes);

// 404 handler
app.use((req, res) => {
  console.log('404 Not Found:', req.method, req.url);
  res.status(404).json({ 
    message: 'Route not found',
    method: req.method,
    url: req.url,
    availableRoutes: [
      '/health',
      '/init-database',
      '/debug',
      '/onboarding',
      '/onboarding/education',
      '/profile',
      '/settings',
      '/jobs',
      '/refer',
      '/dashboard',
      '/login',
      '/pricing'
    ]
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Enhanced error handling middleware
app.use((error, req, res, next) => {
  console.error('\n=== Application Error ===');
  console.error('Error:', error);
  console.error('Stack:', error.stack);
  console.error('Request URL:', req.url);
  console.error('Request Method:', req.method);
  console.error('Request Body:', req.body);
  console.error('Request Headers:', req.headers);
  
  // Handle specific error types
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: error.message,
      details: error.details || error.errors
    });
  }
  
  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: 'Database Validation Error',
      message: error.message,
      details: error.errors?.map(err => ({
        field: err.path,
        message: err.message,
        value: err.value
      }))
    });
  }
  
  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      error: 'Duplicate Entry',
      message: 'A record with this information already exists',
      details: error.errors?.map(err => ({
        field: err.path,
        message: err.message
      }))
    });
  }
  
  // Handle database connection errors
  if (error.message && (error.message.includes('SSL') || error.message.includes('TLS'))) {
    return res.status(500).json({
      error: 'Database Connection Error',
      message: 'SSL/TLS connection issue with database',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
  
  if (error.name === 'SequelizeConnectionError' || error.name === 'SequelizeHostNotFoundError') {
    return res.status(500).json({
      error: 'Database Connection Error',
      message: 'Unable to connect to database',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
  
  if (error.message && error.message.includes('CORS')) {
    return res.status(403).json({
      error: 'CORS Error',
      message: 'Request blocked by CORS policy',
      origin: req.headers.origin
    });
  }
  
  // Generic error response
  res.status(error.status || 500).json({ 
    error: 'Internal Server Error',
    message: error.message,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

module.exports = app;
