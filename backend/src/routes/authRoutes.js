const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  updateProfile,
  addAddress,
  deleteAddress,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", protect, logoutUser);

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

router.post("/addresses", protect, addAddress);
router.delete("/addresses/:addressId", protect, deleteAddress);

module.exports = router;
