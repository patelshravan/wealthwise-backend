const catchAsync = require("../utils/catchAsync");
const dashboardService = require("../services/dashboard.service");

exports.getDashboardData = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const data = await dashboardService.getUserDashboardData(userId);
  res
    .status(200)
    .json({ message: "Dashboard data fetched successfully", data });
});
