const asyncHandler = require("express-async-handler");
const ContactMessage = require("../models/ContactMessage");

const createContactMessage = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    res.status(400);
    throw new Error("Name, email, subject and message are required");
  }

  const contactMessage = await ContactMessage.create({ name, email, subject, message });
  res.status(201).json({ success: true, message: "Message sent successfully", contactMessage });
});

const getContactMessages = asyncHandler(async (req, res) => {
  const messages = await ContactMessage.find().sort({ createdAt: -1 });
  res.json({ success: true, count: messages.length, messages });
});

const updateContactMessage = asyncHandler(async (req, res) => {
  const item = await ContactMessage.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error("Message not found");
  }
  item.isRead = req.body.isRead ?? item.isRead;
  await item.save();
  res.json({ success: true, message: item });
});

const deleteContactMessage = asyncHandler(async (req, res) => {
  const item = await ContactMessage.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error("Message not found");
  }
  await item.deleteOne();
  res.json({ success: true, message: "Message deleted" });
});

module.exports = { createContactMessage, getContactMessages, updateContactMessage, deleteContactMessage };
