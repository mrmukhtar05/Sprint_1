const asyncHandler = require("express-async-handler");
const HomeSettings = require("../models/HomeSettings");

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
  let settings = await HomeSettings.findOne({ key: "home" });
  if (!settings) settings = await HomeSettings.create(defaults);
  res.json({ success: true, settings });
});

const updateHomeSettings = asyncHandler(async (req, res) => {
  const settings = await HomeSettings.findOneAndUpdate(
    { key: "home" },
    { $set: { ...req.body, key: "home" } },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );
  res.json({ success: true, settings });
});

module.exports = { getHomeSettings, updateHomeSettings };
