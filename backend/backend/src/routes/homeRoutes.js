const express = require("express");
const { getHomeSettings } = require("../controllers/homeController");

const router = express.Router();
router.get("/", getHomeSettings);

module.exports = router;
