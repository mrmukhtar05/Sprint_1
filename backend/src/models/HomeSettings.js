const mongoose = require("mongoose");

const homeSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: "home", unique: true },
    eyebrow: { type: String, default: "VINTAGE • STREETWEAR • GRAILS" },
    titleLine1: { type: String, default: "WEAR THE" },
    titleLine2: { type: String, default: "PAST." },
    description: { type: String, default: "Curated vintage pieces, rare streetwear and timeless grails for people who wear their own story." },
    heroImage: { type: String, default: "" },
    primaryButtonText: { type: String, default: "SHOP NOW →" },
    primaryButtonLink: { type: String, default: "/shop" },
    secondaryButtonText: { type: String, default: "EXPLORE" },
    secondaryButtonLink: { type: String, default: "/categories" },
    stats: {
      type: [
        {
          value: String,
          label: String,
        },
      ],
      default: [
        { value: "3K+", label: "PIECES" },
        { value: "100%", label: "CURATED" },
        { value: "2021", label: "EST." },
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HomeSettings", homeSettingsSchema);
