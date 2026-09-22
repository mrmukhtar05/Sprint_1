const express = require("express");
const { getCategories, getCategory } = require("../controllers/categoryController");

const router = express.Router();

router.get("/", getCategories);
router.get("/:idOrSlug", getCategory);

module.exports = router;
