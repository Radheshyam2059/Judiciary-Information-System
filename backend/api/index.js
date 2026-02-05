const express = require("express");

const app = express();

app.use(express.json());

// Simple health check - no dependencies
app.get("/", (req, res) => {
  res.json({ 
    status: "ok",
    message: "API is running",
    timestamp: new Date().toISOString()
  });
});

app.all("*", (req, res) => {
  res.json({ 
    status: "error",
    message: "Route not found",
    path: req.path,
    method: req.method
  });
});

module.exports = app;
