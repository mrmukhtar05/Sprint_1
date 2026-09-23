const User = require("../models/User");

async function ensureSeed() {
  // =========================
  // ADMIN USER
  // =========================
  const admin = await User.findOne({
    email: "admin@vintagevault.com",
  }).select("+password");

  if (!admin) {
    await User.create({
      name: "Admin",
      email: "admin@vintagevault.com",
      password: "admin123",
      role: "admin",
    });
  } else if (admin.role !== "admin" || !admin.isActive) {
    admin.role = "admin";
    admin.isActive = true;
    await admin.save();
  }

  // =========================
  // DEMO CUSTOMER
  // =========================
  if (
    !(await User.exists({
      email: "customer@vintagevault.com",
    }))
  ) {
    await User.create({
      name: "Demo Customer",
      email: "customer@vintagevault.com",
      password: "customer123",
      role: "customer",
    });
  }

  return {
    admin: true,
    customer: true,
    categories: 0,
    products: 0,
  };
}

if (require.main === module) {
  require("dotenv").config();

  const mongoose = require("mongoose");
  const connectDB = require("../config/db");

  connectDB()
    .then(async () => {
      const result = await ensureSeed();

      console.log("Seed complete:", result);

      await mongoose.connection.close();
    })
    .catch((err) => {
      console.error("Seed failed:", err);
      process.exitCode = 1;
    });
}

module.exports = ensureSeed;