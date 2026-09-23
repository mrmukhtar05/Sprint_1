const asyncHandler = require("express-async-handler");
const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");

// @desc  Get logged-in user's wishlist
// @route GET /api/wishlist
// @access Private
const getWishlist = asyncHandler(async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
    "products",
    "name images price discountPrice stock isActive rating"
  );

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, products: [] });
  }

  res.json({ success: true, wishlist });
});

// @desc  Add product to wishlist
// @route POST /api/wishlist
// @access Private
const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, products: [] });
  }

  if (!wishlist.products.some((p) => p.toString() === productId)) {
    wishlist.products.push(productId);
    await wishlist.save();
  }

  await wishlist.populate("products", "name images price discountPrice stock isActive rating");
  res.status(201).json({ success: true, wishlist });
});

// @desc  Remove product from wishlist
// @route DELETE /api/wishlist/:productId
// @access Private
const removeFromWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    res.status(404);
    throw new Error("Wishlist not found");
  }

  wishlist.products = wishlist.products.filter(
    (p) => p.toString() !== req.params.productId
  );

  await wishlist.save();
  await wishlist.populate("products", "name images price discountPrice stock isActive rating");

  res.json({ success: true, wishlist });
});

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
