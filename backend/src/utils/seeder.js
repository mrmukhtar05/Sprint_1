const User = require("../models/User");
const Category = require("../models/Category");
const Product = require("../models/Product");

const slugify = (text) => text.toString().toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");

async function ensureSeed() {
  const admin = await User.findOne({ email: "admin@vintagevault.com" }).select("+password");
  if (!admin) {
    await User.create({ name: "Admin", email: "admin@vintagevault.com", password: "admin123", role: "admin" });
  } else if (admin.role !== "admin" || !admin.isActive) {
    admin.role = "admin"; admin.isActive = true; await admin.save();
  }

  if (!(await User.exists({ email: "customer@vintagevault.com" }))) {
    await User.create({ name: "Demo Customer", email: "customer@vintagevault.com", password: "customer123", role: "customer" });
  }

  const categoryData = [["Furniture", "furniture"], ["Clothing", "clothing"], ["Accessories", "accessories"], ["Home Decor", "home-decor"]];
  const categories = [];
  for (const [name, slug] of categoryData) categories.push(await Category.findOneAndUpdate({ slug }, { name, slug }, { new: true, upsert: true, setDefaultsOnInsert: true }));

  const products = [
    { name: "1970s Teak Armchair", description: "A beautifully preserved teak armchair from the 1970s.", brand: "Unbranded", category: categories[0]._id, images: [], price: 8999, discountPrice: 7499, stock: 4, condition: "good", era: "1970s", tags: ["chair", "teak", "retro"], isFeatured: true },
    { name: "Vintage Denim Jacket", description: "Classic faded denim jacket, 90s era.", brand: "Levi's", category: categories[1]._id, images: [], price: 2499, discountPrice: 0, stock: 10, condition: "like-new", era: "1990s", tags: ["jacket", "denim"], isFeatured: true },
    { name: "Antique Pocket Watch", description: "Brass pocket watch with intricate engravings.", brand: "Unbranded", category: categories[2]._id, images: [], price: 3499, discountPrice: 0, stock: 2, condition: "fair", era: "Victorian", tags: ["watch", "antique"] },
  ];
  for (const product of products) {
    const slug = slugify(product.name);
    await Product.findOneAndUpdate({ slug }, { $setOnInsert: { ...product, slug } }, { upsert: true, setDefaultsOnInsert: true });
  }
  return { admin: true, customer: true, categories: categories.length, products: products.length };
}

if (require.main === module) {
  require("dotenv").config();
  const mongoose = require("mongoose");
  const connectDB = require("../config/db");
  connectDB().then(async () => { const result = await ensureSeed(); console.log("Seed complete", result); await mongoose.connection.close(); }).catch(err => { console.error(err); process.exitCode = 1; });
}

module.exports = ensureSeed;
