const asyncHandler = require("express-async-handler");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("Image file is required");
  }

  const type = String(req.body?.type || "general").toLowerCase();

  const folder =
    type === "category"
      ? "vintage-vault/categories"
      : type === "product"
        ? "vintage-vault/products"
        : "vintage-vault/general";

  const result = await uploadToCloudinary(req.file.buffer, folder);

  res.status(200).json({
    success: true,
    message: "Image uploaded successfully",
    url: result.secure_url,
    public_id: result.public_id,
  });
});

module.exports = {
  uploadImage,
};