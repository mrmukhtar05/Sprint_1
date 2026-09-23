const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const Category = require("../models/Category");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true })
    .select("_id name description image isActive createdAt updatedAt")
    .sort({ name: 1 })
    .lean();

  res.json({
    success: true,
    count: categories.length,
    categories,
  });
});

const getCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid category ID");
  }

  const category = await Category.findOne({
    _id: id,
    isActive: true,
  })
    .select("_id name description image isActive createdAt updatedAt")
    .lean();

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  res.json({
    success: true,
    category,
  });
});

const createCategory = asyncHandler(async (req, res) => {
  const name = String(req.body?.name || "").trim();
  const description = String(req.body?.description || "").trim();

  if (!name) {
    res.status(400);
    throw new Error("Category name is required");
  }

  const duplicate = await Category.findOne({
    name: { $regex: `^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" },
  });

  if (duplicate) {
    res.status(409);
    throw new Error("Category with this name already exists");
  }

  let image = String(req.body?.image || "").trim();

  if (req.file) {
    const uploaded = await uploadToCloudinary(
      req.file.buffer,
      "vintage-vault/categories"
    );
    image = uploaded.secure_url;
  }

  const category = await Category.create({
    name,
    description,
    image,
    isActive: true,
  });

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    category,
  });
});

const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid category ID");
  }

  const category = await Category.findById(id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  if (req.body.name !== undefined) {
    const name = String(req.body.name).trim();

    if (!name) {
      res.status(400);
      throw new Error("Category name cannot be empty");
    }

    const duplicate = await Category.findOne({
      _id: { $ne: id },
      name: {
        $regex: `^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
        $options: "i",
      },
    });

    if (duplicate) {
      res.status(409);
      throw new Error("Category with this name already exists");
    }

    category.name = name;
  }

  if (req.body.description !== undefined) {
    category.description = String(req.body.description).trim();
  }

  if (req.body.image !== undefined) {
    category.image = String(req.body.image || "").trim();
  }

  if (req.file) {
    const uploaded = await uploadToCloudinary(
      req.file.buffer,
      "vintage-vault/categories"
    );
    category.image = uploaded.secure_url;
  }

  if (req.body.isActive !== undefined) {
    category.isActive =
      req.body.isActive === true || req.body.isActive === "true";
  }

  await category.save();

  res.json({
    success: true,
    message: "Category updated successfully",
    category,
  });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid category ID");
  }

  const category = await Category.findById(id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  const Product = require("../models/Product");
  const productCount = await Product.countDocuments({ category: id });

  if (productCount > 0) {
    res.status(400);
    throw new Error(
      `Cannot delete category while ${productCount} product(s) use it`
    );
  }

  await category.deleteOne();

  res.json({
    success: true,
    message: "Category deleted successfully",
  });
});

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
