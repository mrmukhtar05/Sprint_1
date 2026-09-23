require("dotenv").config();

const mongoose = require("mongoose");

const connectDB = require("../config/db");
const Category = require("../models/Category");
const Product = require("../models/Product");

const cleanupCatalog = async () => {
  try {
    await connectDB();

    console.log("Starting catalog cleanup...");

    const productResult = await Product.deleteMany({});
    const categoryResult = await Category.deleteMany({});

    console.log("=================================");
    console.log("CATALOG CLEANUP COMPLETE");
    console.log("Products deleted:", productResult.deletedCount);
    console.log("Categories deleted:", categoryResult.deletedCount);
    console.log("=================================");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("CATALOG CLEANUP FAILED");
    console.error("Message:", error.message);

    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }

    process.exit(1);
  }
};

cleanupCatalog();