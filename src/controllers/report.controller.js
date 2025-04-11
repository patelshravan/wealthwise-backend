const taxReportService = require("../services/report.service");
const catchAsync = require("../utils/catchAsync");

const getUserTaxReportData = catchAsync(async (req, res) => {
    const userId = req.user._id;
    const data = await taxReportService.generateUserTaxReportData(userId);
    res.status(200).json({
        message: "Tax report data fetched successfully",
        data,
    });
});

module.exports = { getUserTaxReportData }