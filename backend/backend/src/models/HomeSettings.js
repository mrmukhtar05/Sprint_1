const mongoose = require("mongoose");

const homeSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: "home", unique: true },
    eyebrow: { type: String, default: "VINTAGE • STREETWEAR • GRAILS", trim: true },
    titleLine1: { type: String, default: "WEAR THE", trim: true },
    titleLine2: { type: String, default: "PAST.", trim: true },
    description: { type: String, default: "Curated vintage pieces, rare streetwear and timeless grails for people who wear their own story.", trim: true },
    heroImage: { type: String, default: "", trim: true },
    primaryButtonText: { type: String, default: "SHOP NOW →", trim: true },
    primaryButtonLink: { type: String, default: "/shop", trim: true },
    secondaryButtonText: { type: String, default: "EXPLORE", trim: true },
    secondaryButtonLink: { type: String, default: "/categories", trim: true },
    stats: {
      type: [
        {
          value: { type: String, trim: true },
          label: { type: String, trim: true },
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
