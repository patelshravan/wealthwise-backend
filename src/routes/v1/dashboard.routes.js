const express = require("express");
const router = express.Router();
const dashboardController = require("../../controllers/dashboard.controller");
const { protect } = require("../../middleware/auth.middleware");

router.get("/stats", protect, dashboardController.getDashboardData);

module.exports = router;
