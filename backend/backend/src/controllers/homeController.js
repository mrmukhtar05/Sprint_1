const asyncHandler = require("express-async-handler");
const HomeSettings = require("../models/HomeSettings");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

const defaults = {
  key: "home",
  eyebrow: "VINTAGE • STREETWEAR • GRAILS",
  titleLine1: "WEAR THE",
  titleLine2: "PAST.",
  description: "Curated vintage pieces, rare streetwear and timeless grails for people who wear their own story.",
  heroImage: "",
  primaryButtonText: "SHOP NOW →",
  primaryButtonLink: "/shop",
  secondaryButtonText: "EXPLORE",
  secondaryButtonLink: "/categories",
  stats: [
    { value: "3K+", label: "PIECES" },
    { value: "100%", label: "CURATED" },
    { value: "2021", label: "EST." },
  ],
};

const getHomeSettings = asyncHandler(async (req, res) => {
  let settings = await HomeSettings.findOne({ key: "home" }).lean();

  if (!settings) {
    settings = await HomeSettings.create(defaults);
    settings = settings.toObject();
  }

  res.json({ success: true, settings });
});

const updateHomeSettings = asyncHandler(async (req, res) => {
  const allowedFields = [
    "eyebrow",
    "titleLine1",
    "titleLine2",
    "description",
    "primaryButtonText",
    "primaryButtonLink",
    "secondaryButtonText",
    "secondaryButtonLink",
    "stats",
  ];

  const updates = {};

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  if (updates.stats !== undefined && typeof updates.stats === "string") {
    try {
      updates.stats = JSON.parse(updates.stats);
    } catch (error) {
      res.status(400);
      throw new Error("stats must be valid JSON");
    }
  }

  if (req.file) {
    const uploadResult = await uploadToCloudinary(
      req.file.buffer,
      "vintage-vault/home"
    );

    if (!uploadResult?.secure_url) {
      res.status(500);
      throw new Error("Cloudinary did not return a secure URL");
    }

    updates.heroImage = uploadResult.secure_url;
  }

  const settings = await HomeSettings.findOneAndUpdate(
    { key: "home" },
    { $set: { ...updates, key: "home" } },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  ).lean();

  res.json({
    success: true,
    message: req.file
      ? "Home settings and hero image updated successfully"
      : "Home settings updated successfully",
    settings,
  });
});

module.exports = { getHomeSettings, updateHomeSettings };
