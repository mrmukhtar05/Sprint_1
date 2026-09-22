const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

// @desc  Get all products (with search, filter, sort, pagination)
// @route GET /api/products
// @access Public
const getProducts = asyncHandler(async (req, res) => {
  const {
    keyword,
    category,
    minPrice,
    maxPrice,
    condition,
    era,
    sort,
    page = 1,
    limit = 12,
    featured,
  } = req.query;

  const query = { isActive: true };

  if (keyword) {
    query.$text = { $search: keyword };
  }
  if (category) {
    query.category = category;
  }
  if (condition) {
    query.condition = condition;
  }
  if (era) {
    query.era = era;
  }
  if (featured === "true") {
    query.isFeatured = true;
  }
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  let sortOption = { createdAt: -1 };
  if (sort === "price_asc") sortOption = { price: 1 };
  if (sort === "price_desc") sortOption = { price: -1 };
  if (sort === "rating") sortOption = { rating: -1 };
  if (sort === "newest") sortOption = { createdAt: -1 };

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  const [products, total] = await Promise.all([
    Product.find(query)
      .populate("category", "name slug")
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum),
    Product.countDocuments(query),
  ]);

  res.json({
    success: true,
    count: products.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    products,
  });
});

// @desc  Get single product by id or slug
// @route GET /api/products/:idOrSlug
// @access Public
const getProduct = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const isObjectId = idOrSlug.match(/^[0-9a-fA-F]{24}$/);

  const product = await Product.findOne({
    $or: [{ _id: isObjectId ? idOrSlug : null }, { slug: idOrSlug }],
  }).populate("category", "name slug");

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json({ success: true, product });
});

// @desc  Create a review for a product
// @route POST /api/products/:id/reviews
// @access Private
const createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error("You have already reviewed this product");
  }

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

  await product.save();
  res.status(201).json({ success: true, message: "Review added" });
});

// ----------------- ADMIN -----------------

// @desc  Create product
// @route POST /api/admin/products
// @access Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    brand,
    category,
    images,
    price,
    discountPrice,
    stock,
    sku,
    condition,
    era,
    tags,
    isFeatured,
  } = req.body;

  if (!name || !price || !category) {
    res.status(400);
    throw new Error("Name, price and category are required");
  }

  let slug = slugify(name);
  const existing = await Product.findOne({ slug });
  if (existing) {
    slug = `${slug}-${Date.now()}`;
  }

  const product = await Product.create({
    name,
    slug,
    description,
    brand,
    category,
    images: images || [],
    price,
    discountPrice,
    stock,
    sku,
    condition,
    era,
    tags,
    isFeatured,
  });

  res.status(201).json({ success: true, product });
});

// @desc  Update product
// @route PUT /api/admin/products/:id
// @access Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const fields = [
    "name",
    "description",
    "brand",
    "category",
    "images",
    "price",
    "discountPrice",
    "stock",
    "sku",
    "condition",
    "era",
    "tags",
    "isFeatured",
    "isActive",
  ];

  fields.forEach((field) => {
    if (req.body[field] !== undefined) product[field] = req.body[field];
  });

  if (req.body.name) product.slug = slugify(req.body.name);

  const updated = await product.save();
  res.json({ success: true, product: updated });
});

// @desc  Delete product
// @route DELETE /api/admin/products/:id
// @access Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await product.deleteOne();
  res.json({ success: true, message: "Product deleted" });
});

module.exports = {
  getProducts,
  getProduct,
  createReview,
  createProduct,
  updateProduct,
  deleteProduct,
};
