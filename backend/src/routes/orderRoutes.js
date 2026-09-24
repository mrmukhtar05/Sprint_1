const express = require("express");
const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  verifyRazorpayPayment,
} = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.post("/", createOrder);
router.get("/my", getMyOrders);
router.get("/:id", getOrderById);
router.put("/:id/cancel", cancelOrder);
router.post("/razorpay/verify", verifyRazorpayPayment);

module.exports = router;
