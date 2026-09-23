require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");
const ensureSeed = require("./utils/seeder");
const cloudinary = require("./config/cloudinary");

const PORT = process.env.PORT || 5000;

console.log("=================================");
console.log("ENVIRONMENT CHECK");
console.log("Cloudinary:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME
    ? "LOADED"
    : "MISSING",

  api_key: process.env.CLOUDINARY_API_KEY
    ? "LOADED"
    : "MISSING",

  api_secret: process.env.CLOUDINARY_API_SECRET
    ? "LOADED"
    : "MISSING",
});
console.log("=================================");

const startServer = async () => {
  try {
    await connectDB();
    console.log("MongoDB connection: OK");

    try {
      const result = await cloudinary.api.ping();

      console.log("Cloudinary connection: OK");
      console.log("Cloudinary status:", result.status);
    } catch (error) {
      console.error("Cloudinary connection FAILED");
      console.error("Message:", error.message);
      console.error("HTTP code:", error.http_code || "N/A");

      process.exit(1);
    }

    await ensureSeed();

    app.listen(PORT, () => {
      console.log("=================================");
      console.log(`Server running on port ${PORT}`);
      console.log(`API: http://localhost:${PORT}`);
      console.log("=================================");
    });
  } catch (error) {
    console.error("SERVER STARTUP FAILED");
    console.error("Message:", error.message);
    process.exit(1);
  }
};

startServer();