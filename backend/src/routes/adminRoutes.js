const express = require("express");
const { protect, admin } = require("../middleware/authMiddleware");
const {
  uploadImage: uploadMiddleware,
} = require("../middleware/uploadMiddleware");

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
  getPayments,
} = require("../controllers/orderController");

const {
  getContactMessages,
  updateContactMessage,
  deleteContactMessage,
} = require("../controllers/contactController");

const {
  getHomeSettings,
  updateHomeSettings,
} = require("../controllers/homeController");

const {
  getCustomers,
  getCustomerById,
  updateCustomerStatus,
  getDashboardStats,
  getAdminProducts,
} = require("../controllers/adminController");

const router = express.Router();

router.use(protect, admin);

router.get("/dashboard", getDashboardStats);

router.get("/messages", getContactMessages);
router.put("/messages/:id", updateContactMessage);
router.delete("/messages/:id", deleteContactMessage);

router.get("/home", getHomeSettings);
router.put(
  "/home",
  uploadMiddleware.single("heroImage"),
  updateHomeSettings
);

router.get("/products", getAdminProducts);
router.post(
  "/products",
  uploadMiddleware.array("images", 10),
  createProduct
);
router.put(
  "/products/:id",
  uploadMiddleware.array("images", 10),
  updateProduct
);
router.delete("/products/:id", deleteProduct);

router.post(
  "/categories",
  uploadMiddleware.single("image"),
  createCategory
);
router.put(
  "/categories/:id",
  uploadMiddleware.single("image"),
  updateCategory
);
router.delete("/categories/:id", deleteCategory);

router.get("/orders", getAllOrders);
router.put("/orders/:id/status", updateOrderStatus);
router.get("/payments", getPayments);

router.get("/customers", getCustomers);
router.get("/customers/:id", getCustomerById);
router.put("/customers/:id/status", updateCustomerStatus);

module.exports = router;
