const catchAsync = require("../utils/catchAsync");
const dashboardService = require("../services/dashboard.service");
const { getDateRange } = require("../utils/getDateRange");

exports.getDashboardData = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const { filter = "this_month", from, to } = req.query;

  const dateRange = getDateRange(filter, from, to);

  const data = await dashboardService.getUserDashboardData(userId, dateRange);

  res.status(200).json({
    message: "Dashboard data fetched successfully",
    data,
  });
});
