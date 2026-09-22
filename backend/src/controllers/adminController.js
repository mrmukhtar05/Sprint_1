const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");

// @desc  Get all customers
// @route GET /api/admin/customers
// @access Private/Admin
const getCustomers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search } = req.query;
  const query = { role: "customer" };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const pageNum = Number(page);
  const limitNum = Number(limit);

  const [customers, total] = await Promise.all([
    User.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    User.countDocuments(query),
  ]);

  res.json({
    success: true,
    count: customers.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    customers,
  });
});

// @desc  Get single customer + their order history
// @route GET /api/admin/customers/:id
// @access Private/Admin
const getCustomerById = asyncHandler(async (req, res) => {
  const customer = await User.findById(req.params.id);

  if (!customer) {
    res.status(404);
    throw new Error("Customer not found");
  }

  const orders = await Order.find({ user: customer._id }).sort({ createdAt: -1 });

  res.json({ success: true, customer, orders });
});

// @desc  Activate / deactivate a customer account
// @route PUT /api/admin/customers/:id/status
// @access Private/Admin
const updateCustomerStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body;
  const customer = await User.findById(req.params.id);

  if (!customer) {
    res.status(404);
    throw new Error("Customer not found");
  }

  customer.isActive = isActive;
  await customer.save();

  res.json({ success: true, customer });
});

// @desc  Dashboard summary stats
// @route GET /api/admin/dashboard
// @access Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalProducts, totalCustomers, totalOrders, orders, lowStockProducts] =
    await Promise.all([
      Product.countDocuments(),
      User.countDocuments({ role: "customer" }),
      Order.countDocuments(),
      Order.find({ status: { $ne: "cancelled" } }),
      Product.find({ stock: { $lte: 5 }, isActive: true }).select("name stock"),
    ]);

  const totalRevenue = orders.reduce((acc, o) => acc + o.totalPrice, 0);

  const statusCounts = await Order.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const recentOrders = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({
    success: true,
    stats: {
      totalProducts,
      totalCustomers,
      totalOrders,
      totalRevenue,
      lowStockCount: lowStockProducts.length,
      lowStockProducts,
      statusCounts,
      recentOrders,
    },
  });
});

module.exports = {
  getCustomers,
  getCustomerById,
  updateCustomerStatus,
  getDashboardStats,
};
