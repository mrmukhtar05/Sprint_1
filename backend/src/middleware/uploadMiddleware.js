const multer = require("multer");

const allowed = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
]);

const storage = multer.memoryStorage();

const uploadImage = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (!allowed.has(file.mimetype)) {
      return cb(
        new Error(
          "Only JPG, PNG, WebP and SVG images are allowed."
        )
      );
    }

    cb(null, true);
  },
});

module.exports = {
  uploadImage,
};