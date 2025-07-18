const express = require("express");
const app = express();
const contactDetails = require("./routes/onboarding/contactDetails.js");
const educationRoutes = require("./routes/onboarding/education.js");
const main = require("./routes/profile/main.js");
const settingRoutes = require("./routes/settings/settingRoutes.js");
const savedAndApplied = require("./routes/jobs/savedAndApplied.js");
const h1bSponsorCases = require("./routes/jobs/h1bSponsorCases.js");
const permReports = require("./routes/jobs/permReports.js");
const referals = require("./routes/referals/referals.js");
const pricing = require("./routes/pricing/pricing.js");
const bodyParser = require("body-parser");
const columnsAndDashBoard = require("./routes/dashboard/columnsAndDashboard.js");
const loginRoutes = require("./routes/dashboard/loginRoutes.js");
const linksRoutes = require("./routes/onboarding/links.js");

const cors = require("cors");
// Using CommonJS, no need for createRequire

// Database connection test
const sequelize = require("./config/database.js");

// Debug middleware
app.use((req, res, next) => {
  console.log('Incoming Request:', req.method, req.url);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json()); // Parses JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parses form-encoded bodies
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
);

// Database connection test endpoint
app.get("/health", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ 
      status: "ok", 
      database: "connected",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Database connection test failed:", error);
    res.status(500).json({ 
      status: "error", 
      database: "disconnected",
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.use("/onboarding", contactDetails);
app.use("/onboarding/education", educationRoutes);
app.use("/profile", main);
app.use("/settings", settingRoutes);
app.use("/jobs", savedAndApplied);
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
  res.status(404).json({ message: 'Route not found' });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Application Error:', error);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: error.message 
  });
});

module.exports = app;
