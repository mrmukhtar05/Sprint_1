const asyncHandler = require("express-async-handler");
const crypto = require("crypto");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");

const getRazorpayAuth = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;
  return `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`;
};

const createRazorpayOrder = async ({ amount, receipt }) => {
  const auth = getRazorpayAuth();
  if (!auth) throw new Error("Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to backend .env");
  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: { Authorization: auth, "Content-Type": "application/json" },
    body: JSON.stringify({ amount: Math.round(amount * 100), currency: "INR", receipt, payment_capture: 1 }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.description || "Unable to create Razorpay order");
  return data;
};

const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod = "COD" } = req.body;
  if (!orderItems?.length) { res.status(400); throw new Error("No order items provided"); }
  if (!["COD", "RAZORPAY"].includes(paymentMethod)) { res.status(400); throw new Error("Invalid payment method"); }
  if (!shippingAddress?.fullName || !shippingAddress?.phone || !shippingAddress?.line1 || !shippingAddress?.city || !shippingAddress?.state || !shippingAddress?.postalCode || !shippingAddress?.country) { res.status(400); throw new Error("Complete shipping address is required"); }

  const builtItems = [];
  const productsToSave = [];
  for (const item of orderItems) {
    const quantity = Number(item.quantity);
    if (!Number.isInteger(quantity) || quantity < 1) { res.status(400); throw new Error("Invalid quantity"); }
    const product = await Product.findById(item.product);
    if (!product || !product.isActive) { res.status(404); throw new Error(`Product not found: ${item.product}`); }
    if (product.stock < quantity || product.stock <= 0) { res.status(400); throw new Error(`${product.name} is out of stock or has insufficient stock`); }
    builtItems.push({ product: product._id, name: product.name, image: product.images?.[0] || "", price: product.discountPrice > 0 ? product.discountPrice : product.price, size: item.size || "One Size", color: item.color || "Default", quantity });
    product.stock -= quantity;
    productsToSave.push(product);
  }

  const itemsPrice = builtItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const shippingPrice = itemsPrice > 2000 ? 0 : 99;
  const taxPrice = Math.round(itemsPrice * 0.05 * 100) / 100;
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  await Promise.all(productsToSave.map((p) => p.save()));

  try {
    const order = await Order.create({ user: req.user._id, orderItems: builtItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice, isPaid: false });
    if (paymentMethod === "RAZORPAY") {
      const rpOrder = await createRazorpayOrder({ amount: totalPrice, receipt: order._id.toString() });
      order.razorpayOrderId = rpOrder.id;
      await order.save();
      return res.status(201).json({ success: true, order, razorpay: { keyId: process.env.RAZORPAY_KEY_ID, orderId: rpOrder.id, amount: rpOrder.amount, currency: rpOrder.currency } });
    }
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    return res.status(201).json({ success: true, order });
  } catch (error) {
    await Promise.all(productsToSave.map((p) => Product.findByIdAndUpdate(p._id, { $inc: { stock: builtItems.find((i) => i.product.toString() === p._id.toString()).quantity } })));
    throw error;
  }
});

const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
  const order = await Order.findOne({ _id: orderId, user: req.user._id });
  if (!order) { res.status(404); throw new Error("Order not found"); }
  if (order.paymentMethod !== "RAZORPAY") { res.status(400); throw new Error("This order is not a Razorpay order"); }
  const expected = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(`${razorpayOrderId}|${razorpayPaymentId}`).digest("hex");
  if (expected !== razorpaySignature || order.razorpayOrderId !== razorpayOrderId) {
    order.status = "cancelled";
    await order.save();
    for (const item of order.orderItems) await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
    res.status(400); throw new Error("Razorpay payment verification failed");
  }
  order.razorpayPaymentId = razorpayPaymentId;
  order.razorpaySignature = razorpaySignature;
  order.isPaid = true;
  order.paidAt = new Date();
  await order.save();
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
  res.json({ success: true, order });
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, count: orders.length, orders });
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");
  if (!order) { res.status(404); throw new Error("Order not found"); }
  const ownerId = order.user._id ? order.user._id.toString() : order.user.toString();
  if (ownerId !== req.user._id.toString() && req.user.role !== "admin") { res.status(403); throw new Error("Not authorized to view this order"); }
  res.json({ success: true, order });
});

const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error("Order not found"); }
  if (order.user.toString() !== req.user._id.toString()) { res.status(403); throw new Error("Not authorized to cancel this order"); }
  if (!["pending", "processing"].includes(order.status)) { res.status(400); throw new Error("Order can no longer be cancelled"); }
  order.status = "cancelled";
  await order.save();
  for (const item of order.orderItems) await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
  res.json({ success: true, order });
});

const getAllOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const query = {}; if (status) query.status = status;
  const pageNum = Math.max(Number(page) || 1, 1); const limitNum = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const [orders, total] = await Promise.all([Order.find(query).populate("user", "name email").sort({ createdAt: -1 }).skip((pageNum - 1) * limitNum).limit(limitNum), Order.countDocuments(query)]);
  res.json({ success: true, count: orders.length, total, page: pageNum, pages: Math.ceil(total / limitNum), orders });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body; const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error("Order not found"); }
  const allowed = ["pending", "processing", "shipped", "delivered", "cancelled"];
  if (!allowed.includes(status)) { res.status(400); throw new Error("Invalid order status"); }
  order.status = status; if (status === "delivered") order.deliveredAt = new Date();
  const updated = await order.save(); res.json({ success: true, order: updated });
});

const getPayments = asyncHandler(async (req, res) => {
  const { method, status, page = 1, limit = 50 } = req.query;
  const query = {};
  if (method && ["COD", "RAZORPAY"].includes(method)) query.paymentMethod = method;
  if (status === "paid") query.isPaid = true;
  if (status === "unpaid") query.isPaid = false;
  const pageNum = Math.max(Number(page) || 1, 1); const limitNum = Math.min(Math.max(Number(limit) || 50, 1), 100);
  const [payments, total, aggregates] = await Promise.all([
    Order.find(query).populate("user", "name email").sort({ createdAt: -1 }).skip((pageNum - 1) * limitNum).limit(limitNum),
    Order.countDocuments(query),
    Order.aggregate([{ $match: query }, { $group: { _id: "$paymentMethod", count: { $sum: 1 }, paidAmount: { $sum: { $cond: ["$isPaid", "$totalPrice", 0] } }, totalAmount: { $sum: "$totalPrice" } } }]),
  ]);
  res.json({ success: true, payments, total, page: pageNum, pages: Math.ceil(total / limitNum), summary: aggregates });
});

module.exports = { createOrder, verifyRazorpayPayment, getMyOrders, getOrderById, cancelOrder, getAllOrders, updateOrderStatus, getPayments };
