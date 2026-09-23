const express = require("express");
const {
  getProducts,
  getProduct,
  createReview,
} = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getProducts);
router.get("/:idOrSlug", getProduct);
router.post("/:id/reviews", protect, createReview);

module.exports = router;
