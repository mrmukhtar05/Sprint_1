const express = require("express");
const { protect, admin } = require("../middleware/authMiddleware");

const {
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const {
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const {
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const {
  getContactMessages,
  updateContactMessage,
  deleteContactMessage,
} = require("../controllers/contactController");

const { getHomeSettings, updateHomeSettings } = require("../controllers/homeController");

const {
  getCustomers,
  getCustomerById,
  updateCustomerStatus,
  getDashboardStats,
} = require("../controllers/adminController");

const router = express.Router();

// every route below requires a logged-in admin
router.use(protect, admin);

// Dashboard
router.get("/dashboard", getDashboardStats);

// Contact messages
router.get("/messages", getContactMessages);
router.put("/messages/:id", updateContactMessage);
router.delete("/messages/:id", deleteContactMessage);

// Home page settings
router.get("/home", getHomeSettings);
router.put("/home", updateHomeSettings);

// Products
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

// Categories
router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

// Orders
router.get("/orders", getAllOrders);
router.put("/orders/:id/status", updateOrderStatus);

// Customers
router.get("/customers", getCustomers);
router.get("/customers/:id", getCustomerById);
router.put("/customers/:id/status", updateCustomerStatus);

module.exports = router;
