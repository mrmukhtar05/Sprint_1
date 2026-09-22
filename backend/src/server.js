require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const ensureSeed = require("./utils/seeder");

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  try {
    await ensureSeed();
    console.log("Database bootstrap complete");
  } catch (error) {
    console.error("Database bootstrap failed:", error.message);
  }

  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
  });
});

process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  process.exit(1);
});
