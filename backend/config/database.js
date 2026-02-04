const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

let mongoMemoryServer = null;

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("No MONGODB_URI provided");
    }
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    throw err;
  }
};

module.exports = connectDB;
