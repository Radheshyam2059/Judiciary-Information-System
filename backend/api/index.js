const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("../../config/database");
const authRouter = require("../../routes/authRoute");
const profileRouter = require("../../routes/profileRoute");
const caseRouter = require("../../routes/caseRoute");

const app = express();
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:5173").split(",");

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/api", (req, res) => res.send("API is running..."));
app.use("/api", authRouter);
app.use("/api", profileRouter);
app.use("/api/cases", caseRouter);

// Initialize DB connection
connectDB().catch((err) => console.error("Database error:", err));

module.exports = app;
