// backend/config/db.js
import mongoose from "mongoose";

const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

export async function connectDB() {
  if (!uri) {
    console.error("❌ Missing MONGO_URI/MONGODB_URI env var");
    process.exit(1);
  }
  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
}
