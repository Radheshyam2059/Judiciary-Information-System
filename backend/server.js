const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/database");
const authRouter = require("./routes/authRoute");
const profileRouter = require("./routes/profileRoute");
const caseRouter = require("./routes/caseRoute");

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

app.get("/", (req, res) => res.send("API is running..."));
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/api/cases", caseRouter);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    console.log("Database Connection Established....");
    // Seed a default test user if none exist
    const User = require("./models/User");
    const bcrypt = require("bcryptjs");

    (async () => {
      try {
        const userCount = await User.countDocuments();
        if (userCount === 0) {
          const password = "password123";
          const hashed = await bcrypt.hash(password, 10);
          await User.create({
            name: "Test User",
            email: "test@example.com",
            password: hashed,
            role: "lawyer",
          });
          console.log("Seeded default user: test@example.com / password123");
        }
      } catch (seedErr) {
        console.error("Seeding error:", seedErr);
      }

      app.listen(5000, () => {
        console.log("server running on the port 5000");
      });
    })();
  })
  .catch((err) => console.log("Database not connected successfully!"));
