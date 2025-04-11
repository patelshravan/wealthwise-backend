const express = require("express");
const router = express.Router();
const reportController = require("../../controllers/report.controller");
const { protect } = require('../../middleware/auth.middleware');

router.get("/tax", protect, reportController.getUserTaxReportData);

module.exports = router;
