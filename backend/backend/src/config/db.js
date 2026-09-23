const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Atlas is the primary database. MONGO_URI is kept for backward compatibility.
    const mongoUri = process.env.MONGO_URI_ATLAS || process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("MONGO_URI_ATLAS or MONGO_URI is missing from .env");
    }

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10,
      minPoolSize: 2,
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
    console.log(`MongoDB database: ${conn.connection.name}`);
    console.log(
      `MongoDB source: ${mongoUri.startsWith("mongodb+srv://") ? "MongoDB Atlas" : "MongoDB/local"}`
    );
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
