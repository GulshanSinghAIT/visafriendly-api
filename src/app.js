import express from "express";
const app = express();
import contactDetails from "./routes/onboarding/contactDetails.js";
import educationRoutes from "./routes/onboarding/education.js";
import main from "./routes/profile/main.js";
import settingRoutes from "./routes/settings/settingRoutes.js";
import savedAndApplied from "./routes/jobs/savedAndApplied.js";
import h1bSponsorCases from "./routes/jobs/h1bSponsorCases.js";
import permReports from "./routes/jobs/permReports.js";
import referals from "./routes/referals/referals.js";
import pricing from "./routes/pricing/pricing.js";
import bodyParser from "body-parser";
import columnsAndDashBoard from "./routes/dashboard/columnsAndDashboard.js";
import loginRoutes from "./routes/dashboard/loginRoutes.js";
import linksRoutes from "./routes/onboarding/links.js";

import cors from "cors";

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

export default app;
