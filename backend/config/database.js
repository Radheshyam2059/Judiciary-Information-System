const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

let mongoMemoryServer = null;

const connectDB = async () => {
  try {
    // Try primary URI first (Atlas or local)
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("MongoDB Connected (primary)");
      return;
    }
    throw new Error("No MONGODB_URI provided");
  } catch (err) {
    console.error("Primary MongoDB connection failed:", err.message);
    console.log("Attempting to start in-memory MongoDB as a fallback...");
    try {
      const { MongoMemoryServer } = require("mongodb-memory-server");
      mongoMemoryServer = await MongoMemoryServer.create();
      const uri = mongoMemoryServer.getUri();
      await mongoose.connect(uri);
      console.log("Connected to in-memory MongoDB");
    } catch (memErr) {
      console.error("In-memory MongoDB failed:", memErr);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
