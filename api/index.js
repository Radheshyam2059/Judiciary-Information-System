const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

dotenv.config();

// Load routes from backend
const authRouter = require("../backend/routes/authRoute");
const profileRouter = require("../backend/routes/profileRoute");
const caseRouter = require("../backend/routes/caseRoute");
const connectDB = require("../backend/config/database");

const app = express();

// Initialize DB connection
let dbConnected = false;
const initDB = async () => {
  if (!dbConnected) {
    try {
      await connectDB();
      console.log("✓ Database connected");
      dbConnected = true;
    } catch (err) {
      console.error("✗ Database error:", err.message);
    }
  }
};

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:5173").split(",").map(o => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Health check
app.get("/", async (req, res) => {
  await initDB();
  res.json({ message: "API is running" });
});

// API routes
app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/api/cases", caseRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

module.exports = app;
