const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const contactRoutes = require("./routes/contactRoutes");
const homeRoutes = require("./routes/homeRoutes");

const {
  notFound,
  errorHandler,
} = require("./middleware/errorMiddleware");

const app = express();

// ===============================
// CORS
// ===============================

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.ADMIN_URL,

  // Frontend Vercel
  "https://vintagevault-shop.vercel.app",

  // Admin Vercel
  "https://sprint-1-24dn.vercel.app",

  // Current Admin deployment URL
  "https://sprint-1-24dn-mkvap2zbv-mrmukhtar005-6380s-projects.vercel.app",

  // Local development
  "http://localhost:5173",
  "http://localhost:5174",
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests without an Origin
      // Postman / server-side requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("CORS blocked origin:", origin);

      return callback(new Error("CORS origin not allowed"));
    },

    credentials: true,
  })
);

// ===============================
// BODY PARSING
// ===============================

app.use(express.json({ limit: "10mb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

app.use(cookieParser());

// ===============================
// LOGGER
// ===============================

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// ===============================
// HEALTH CHECK
// ===============================

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Vintage Vault API is running",
  });
});

// ===============================
// ROUTES
// ===============================

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/admin", adminRoutes);

// ===============================
// ERROR HANDLING
// ===============================

app.use(notFound);
app.use(errorHandler);

module.exports = app;