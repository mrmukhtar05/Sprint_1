const asyncHandler = require("express-async-handler");
const Category = require("../models/Category");

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

// @desc  Get all categories
// @route GET /api/categories
// @access Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort("name");
  res.json({ success: true, count: categories.length, categories });
});

// @desc  Get single category by slug or id
// @route GET /api/categories/:idOrSlug
// @access Public
const getCategory = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const category = await Category.findOne({
    $or: [{ _id: idOrSlug.match(/^[0-9a-fA-F]{24}$/) ? idOrSlug : null }, { slug: idOrSlug }],
  });

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  res.json({ success: true, category });
});

// @desc  Create category
// @route POST /api/admin/categories
// @access Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  const { name, description, image } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Category name is required");
  }

  const category = await Category.create({
    name,
    slug: slugify(name),
    description,
    image,
  });

  res.status(201).json({ success: true, category });
});

// @desc  Update category
// @route PUT /api/admin/categories/:id
// @access Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  category.name = req.body.name ?? category.name;
  if (req.body.name) category.slug = slugify(req.body.name);
  category.description = req.body.description ?? category.description;
  category.image = req.body.image ?? category.image;
  category.isActive = req.body.isActive ?? category.isActive;

  const updated = await category.save();
  res.json({ success: true, category: updated });
});

// @desc  Delete category
// @route DELETE /api/admin/categories/:id
// @access Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  await category.deleteOne();
  res.json({ success: true, message: "Category deleted" });
});

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
