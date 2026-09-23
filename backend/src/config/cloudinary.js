const cloudinary = require("cloudinary").v2;

const requiredEnv = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

for (const key of requiredEnv) {
  if (!process.env[key]?.trim()) {
    throw new Error(`${key} is missing from .env`);
  }
}

const config = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME.trim(),
  api_key: process.env.CLOUDINARY_API_KEY.trim(),
  api_secret: process.env.CLOUDINARY_API_SECRET.trim(),
  secure: true,
};

if (process.env.CLOUDINARY_UPLOAD_PREFIX?.trim()) {
  config.upload_prefix = process.env.CLOUDINARY_UPLOAD_PREFIX.trim();
}

cloudinary.config(config);

module.exports = cloudinary;
