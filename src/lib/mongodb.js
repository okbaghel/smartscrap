import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is missing in environment variables");
}

// Global variable to prevent multiple connections
let cached = global.mongoose || { conn: null, promise: null };

export const connectDB = async () => {
  if (cached.conn) {
    console.log("✅ MongoDB already connected");
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI);
  }

  try {
    cached.conn = await cached.promise;
    console.log(" MongoDB connected successfully");
    global.mongoose = cached; // Store in global scope
    return cached.conn;
  } catch (error) {
    console.error(" MongoDB connection error:", error);
    throw new Error("MongoDB connection failed");
  }
};
