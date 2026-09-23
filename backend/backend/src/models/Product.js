const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    description: {
      type: String,
      default: "",
    },

    brand: {
      type: String,
      default: "",
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    images: [{ type: String }],

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    discountPrice: {
      type: Number,
      default: 0,
    },

    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    sku: {
      type: String,
      unique: true,
      sparse: true,
    },

    gender: {
      type: String,
      enum: ["men", "women", "unisex"],
      required: true,
      default: "unisex",
      index: true,
    },

    sizes: {
      type: [String],
      default: [],
    },

    colors: {
      type: [String],
      default: [],
    },

    tags: [{ type: String }],

    rating: {
      type: Number,
      default: 0,
    },

    numReviews: {
      type: Number,
      default: 0,
    },

    reviews: [reviewSchema],

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);


// ===============================
// SEARCH INDEX
// ===============================

productSchema.index({
  name: "text",
  description: "text",
  tags: "text",
});


// ===============================
// PERFORMANCE INDEXES
// ===============================

// Default / newest products
productSchema.index({
  isActive: 1,
  createdAt: -1,
});

// Price low → high
productSchema.index({
  isActive: 1,
  price: 1,
});

// Price high → low
productSchema.index({
  isActive: 1,
  price: -1,
});

// Rating
productSchema.index({
  isActive: 1,
  rating: -1,
});

// Category + newest
productSchema.index({
  isActive: 1,
  category: 1,
  createdAt: -1,
});

productSchema.index({ isActive: 1, gender: 1, createdAt: -1 });
productSchema.index({ isActive: 1, gender: 1, category: 1, createdAt: -1 });

// Category + price
productSchema.index({
  isActive: 1,
  category: 1,
  price: 1,
});

// Featured products
productSchema.index({
  isActive: 1,
  isFeatured: 1,
  createdAt: -1,
});

module.exports = mongoose.model("Product", productSchema);