const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");
const Category = require("../models/Category");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

const slugify = (text) =>
  String(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const normalizeArray = (value) => {
  if (value === undefined || value === null || value === "") return [];

  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item).trim()).filter(Boolean);
      }
    } catch (_) {}

    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const toBoolean = (value, fallback = false) => {
  if (value === undefined) return fallback;
  return value === true || value === "true";
};

const makeUniqueSlug = async (name, excludeId = null) => {
  const base = slugify(name) || `product-${Date.now()}`;
  let slug = base;
  let counter = 1;

  while (
    await Product.exists({
      slug,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    })
  ) {
    slug = `${base}-${counter++}`;
  }

  return slug;
};

const getProducts = asyncHandler(async (req, res) => {
  const {
    keyword,
    category,
    minPrice,
    maxPrice,
    gender,
    size,
    color,
    sort,
    page = 1,
    limit = 12,
    featured,
  } = req.query;

  const query = { isActive: true };

  if (keyword) {
    query.$text = { $search: keyword };
  }

  if (category) query.category = category;
  if (gender) query.gender = gender;
  if (size) query.sizes = size;
  if (color) query.colors = color;
  if (featured === "true") query.isFeatured = true;

  if (minPrice !== undefined || maxPrice !== undefined) {
    query.price = {};

    if (minPrice !== undefined && minPrice !== "") {
      query.price.$gte = Number(minPrice);
    }

    if (maxPrice !== undefined && maxPrice !== "") {
      query.price.$lte = Number(maxPrice);
    }
  }

  const pageNum = Math.max(Number(page) || 1, 1);
  const limitNum = Math.min(Math.max(Number(limit) || 12, 1), 100);

  let sortOption = { createdAt: -1 };

  if (sort === "price_asc") sortOption = { price: 1, _id: 1 };
  if (sort === "price_desc") sortOption = { price: -1, _id: 1 };
  if (sort === "rating") sortOption = { rating: -1, createdAt: -1 };
  if (sort === "newest") sortOption = { createdAt: -1, _id: -1 };

  const [products, total] = await Promise.all([
    Product.find(query)
      .select(
        "name slug description brand category images price discountPrice stock sku gender sizes colors rating numReviews isFeatured isActive createdAt"
      )
      .populate("category", "name image")
      .sort(sortOption)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean(),
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

const getProduct = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;

  const isObjectId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);

  const product = isObjectId
    ? await Product.findOne({
        _id: idOrSlug,
        isActive: true,
      }).populate("category", "name image")
    : await Product.findOne({
        slug: idOrSlug,
        isActive: true,
      }).populate("category", "name image");

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json({
    success: true,
    product,
  });
});

const createReview = asyncHandler(async (req, res) => {
  const { rating, comment = "" } = req.body;
  const numericRating = Number(rating);

  if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
    res.status(400);
    throw new Error("Rating must be an integer from 1 to 5");
  }

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (!product.isActive) {
    res.status(400);
    throw new Error("Product is inactive");
  }

  if (
    product.reviews.some(
      (review) => review.user.toString() === req.user._id.toString()
    )
  ) {
    res.status(400);
    throw new Error("You have already reviewed this product");
  }

  product.reviews.push({
    user: req.user._id,
    name: req.user.name,
    rating: numericRating,
    comment: String(comment).trim(),
  });

  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((sum, review) => sum + review.rating, 0) /
    product.reviews.length;

  await product.save();

  res.status(201).json({
    success: true,
    message: "Review added",
    rating: product.rating,
    numReviews: product.numReviews,
  });
});

const createProduct = asyncHandler(async (req, res) => {
  const name = String(req.body?.name || "").trim();
  const categoryId = req.body?.category;
  const price = Number(req.body?.price);

  if (!name || !categoryId || !Number.isFinite(price) || price < 0) {
    res.status(400);
    throw new Error("Name, valid price and category are required");
  }

  const category = await Category.findById(categoryId).select("_id");
  if (!category) {
    res.status(400);
    throw new Error("Invalid category");
  }

  const discountPrice =
    req.body.discountPrice === undefined || req.body.discountPrice === ""
      ? 0
      : Number(req.body.discountPrice);

  if (!Number.isFinite(discountPrice) || discountPrice < 0 || discountPrice > price) {
    res.status(400);
    throw new Error("Discount price must be between 0 and price");
  }

  const files = Array.isArray(req.files) ? req.files : [];
  const uploadedImages = [];

  for (const file of files) {
    const uploaded = await uploadToCloudinary(
      file.buffer,
      "vintage-vault/products"
    );
    uploadedImages.push(uploaded.secure_url);
  }

  const bodyImages = normalizeArray(req.body.images);
  const images = [...uploadedImages, ...bodyImages];

  const slug = await makeUniqueSlug(name);

  const product = await Product.create({
    name,
    slug,
    description: String(req.body.description || "").trim(),
    brand: String(req.body.brand || "").trim(),
    category: category._id,
    images,
    price,
    discountPrice,
    stock: Math.max(Number(req.body.stock) || 0, 0),
    sku: String(req.body.sku || "").trim() || undefined,
    gender: ["men", "women", "unisex"].includes(req.body.gender)
      ? req.body.gender
      : "unisex",
    sizes: normalizeArray(req.body.sizes),
    colors: normalizeArray(req.body.colors),
    tags: normalizeArray(req.body.tags),
    isFeatured: toBoolean(req.body.isFeatured),
    isActive: toBoolean(req.body.isActive, true),
  });

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    product,
  });
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (req.body.category !== undefined) {
    const category = await Category.findById(req.body.category).select("_id");
    if (!category) {
      res.status(400);
      throw new Error("Invalid category");
    }
    product.category = category._id;
  }

  if (req.body.name !== undefined) {
    const name = String(req.body.name).trim();

    if (!name) {
      res.status(400);
      throw new Error("Product name cannot be empty");
    }

    product.name = name;
    product.slug = await makeUniqueSlug(name, product._id);
  }

  if (req.body.description !== undefined)
    product.description = String(req.body.description).trim();

  if (req.body.brand !== undefined)
    product.brand = String(req.body.brand).trim();

  if (req.body.price !== undefined) {
    const price = Number(req.body.price);
    if (!Number.isFinite(price) || price < 0) {
      res.status(400);
      throw new Error("Invalid price");
    }
    product.price = price;
  }

  if (req.body.discountPrice !== undefined) {
    const discountPrice =
      req.body.discountPrice === "" ? 0 : Number(req.body.discountPrice);

    if (
      !Number.isFinite(discountPrice) ||
      discountPrice < 0 ||
      discountPrice > product.price
    ) {
      res.status(400);
      throw new Error("Invalid discount price");
    }

    product.discountPrice = discountPrice;
  }

  if (req.body.stock !== undefined) {
    const stock = Number(req.body.stock);
    if (!Number.isInteger(stock) || stock < 0) {
      res.status(400);
      throw new Error("Stock must be a non-negative integer");
    }
    product.stock = stock;
  }

  if (req.body.sku !== undefined)
    product.sku = String(req.body.sku).trim() || undefined;

  if (req.body.gender !== undefined) {
    if (!["men", "women", "unisex"].includes(req.body.gender)) {
      res.status(400);
      throw new Error("Gender must be men, women or unisex");
    }
    product.gender = req.body.gender;
  }

  if (req.body.sizes !== undefined) product.sizes = normalizeArray(req.body.sizes);
  if (req.body.colors !== undefined) product.colors = normalizeArray(req.body.colors);
  if (req.body.tags !== undefined) product.tags = normalizeArray(req.body.tags);

  if (req.body.isFeatured !== undefined)
    product.isFeatured = toBoolean(req.body.isFeatured);

  if (req.body.isActive !== undefined)
    product.isActive = toBoolean(req.body.isActive);

  if (req.body.images !== undefined) {
    product.images = normalizeArray(req.body.images);
  }

  const files = Array.isArray(req.files) ? req.files : [];

  if (files.length) {
    for (const file of files) {
      const uploaded = await uploadToCloudinary(
        file.buffer,
        "vintage-vault/products"
      );
      product.images.push(uploaded.secure_url);
    }
  }

  await product.save();

  res.json({
    success: true,
    message: "Product updated successfully",
    product,
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await product.deleteOne();

  res.json({
    success: true,
    message: "Product deleted successfully",
  });
});

module.exports = {
  getProducts,
  getProduct,
  createReview,
  createProduct,
  updateProduct,
  deleteProduct,
};
