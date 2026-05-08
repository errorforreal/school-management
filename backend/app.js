const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");


const schoolRoutes = require("./routes/schoolRoutes");

const app = express();

app.use(express.static(path.join(__dirname, "../frontend")));
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files


// Routes
app.use("/", schoolRoutes);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "API is running!" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

module.exports = app;
