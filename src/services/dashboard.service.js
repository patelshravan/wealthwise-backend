const Expense = require("../models/Expense");
const Investment = require("../models/Investment");
const LICPolicy = require("../models/LICPolicy");
const Savings = require("../models/Savings");
const User = require("../models/User");

const generateSmartSuggestions = ({
  investmentPerformance,
  upcomingLICPayments,
  recentActivity,
  trends,
  financialGoal
}) => {
  const suggestions = [];

  const thisMonth = new Date().getMonth() + 1;
  const lastMonth = thisMonth - 1;

  const monthlyExpenseTrends = trends.expenses || [];
  const currentMonthExpense =
    monthlyExpenseTrends.find((item) => item._id.month === thisMonth)?.total ||
    0;
  const lastMonthExpense =
    monthlyExpenseTrends.find((item) => item._id.month === lastMonth)?.total ||
    0;

  if (currentMonthExpense > lastMonthExpense && lastMonthExpense > 0) {
    suggestions.push("You spent more this month than last month 💸");
  }

  const monthlySaving =
    trends.savings?.find((item) => item._id.month === thisMonth)?.total || 0;

  if (monthlySaving === 0) {
    suggestions.push("You haven't saved anything this month 😬");
  }

  if (investmentPerformance.returnPercentage > 0) {
    suggestions.push(
      `Your investments have grown by ${investmentPerformance.returnPercentage.toFixed(
        2
      )}% 💏`
    );
  }

  if (upcomingLICPayments?.length > 0) {
    const nextDue = new Date(upcomingLICPayments[0].nextDueDate);
    const today = new Date();
    const diff = Math.ceil((nextDue - today) / (1000 * 60 * 60 * 24));
    if (diff <= 7) {
      suggestions.push(`You have an LIC payment due in ${diff} day(s) ⏳`);
    }
  }

  // Late payment check
  recentActivity.policies?.forEach((p) => {
    if (
      p.lastPaidDate &&
      p.dueDate &&
      new Date(p.lastPaidDate) > new Date(p.dueDate)
    ) {
      suggestions.push(
        `Your last LIC premium for "${p.policyName}" was paid late 🕒`
      );
    }
  });

  if (trends.savings?.length > 2) {
    const lastThree = trends.savings.slice(-3).map((s) => s.total);
    if (lastThree[2] > lastThree[1] && lastThree[1] > lastThree[0]) {
      suggestions.push("Your savings are growing steadily 👏");
    }
  }

  // 💰 Financial goal check
  if (financialGoal && trends.savings?.length > 0) {
    const thisMonth = new Date().getMonth() + 1;
    const thisMonthSaving =
      trends.savings.find((item) => item._id.month === thisMonth)?.total || 0;

    if (thisMonthSaving < financialGoal) {
      suggestions.push(
        `You're ₹${(financialGoal - thisMonthSaving).toLocaleString(
          "en-IN"
        )} short of your savings goal this month 😟`
      );
    } else {
      suggestions.push(`You've met your savings goal this month 🎉👏`);
    }
  }

  return suggestions;
};

const getMonthlyTrends = async (
  Model,
  userId,
  amountField = "amount",
  dateFilter = {}
) => {
  return await Model.aggregate([
    { $match: { userId, ...dateFilter } },
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
        },
        total: { $sum: `$${amountField}` },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);
};

const getExpenseCategoryBreakdown = async (userId, dateFilter = {}) => {
  return await Expense.aggregate([
    { $match: { userId, ...dateFilter } },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" },
      },
    },
    { $sort: { total: -1 } },
  ]);
};

exports.getUserDashboardData = async (userId, dateRange = {}) => {
  const { startDate, endDate } = dateRange;

  const dateFilter = {};
  if (startDate && endDate) {
    dateFilter.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  const [
    expenses,
    investments,
    policies,
    savings,
    monthlyExpenses,
    monthlySavings,
    monthlyInvestments,
    categoryBreakdown,
  ] = await Promise.all([
    Expense.aggregate([
      { $match: { userId, ...dateFilter } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Investment.aggregate([
      { $match: { userId, ...dateFilter } },
      {
        $group: {
          _id: null,
          totalInvested: { $sum: "$amountInvested" },
          totalCurrentValue: { $sum: "$currentValue" },
        },
      },
    ]),
    LICPolicy.aggregate([
      { $match: { userId } },
      { $group: { _id: null, totalPremium: { $sum: "$premiumAmount" } } },
    ]),
    Savings.aggregate([
      { $match: { userId, ...dateFilter } },
      { $group: { _id: null, totalSavings: { $sum: "$amount" } } },
    ]),
    getMonthlyTrends(Expense, userId, "amount", dateFilter),
    getMonthlyTrends(Savings, userId, "amount", dateFilter),
    getMonthlyTrends(Investment, userId, "amountInvested", dateFilter),
    getExpenseCategoryBreakdown(userId, dateFilter),
  ]);

  const totalExpenses = expenses[0]?.total || 0;
  const totalSavings = savings[0]?.totalSavings || 0;
  const totalPremium = policies[0]?.totalPremium || 0;
  const totalInvested = investments[0]?.totalInvested || 0;
  const totalCurrentValue = investments[0]?.totalCurrentValue || 0;

  const investmentPerformance = {
    gainOrLoss: totalCurrentValue - totalInvested,
    returnPercentage:
      totalInvested > 0
        ? ((totalCurrentValue - totalInvested) / totalInvested) * 100
        : 0,
  };

  const [recentExpenses, recentSavings, recentInvestments, recentPolicies] =
    await Promise.all([
      Expense.find({ userId, ...dateFilter })
        .sort({ createdAt: -1 })
        .limit(5),
      Savings.find({ userId, ...dateFilter })
        .sort({ createdAt: -1 })
        .limit(5),
      Investment.find({ userId, ...dateFilter })
        .sort({ createdAt: -1 })
        .limit(5),
      LICPolicy.find({ userId }).sort({ createdAt: -1 }).limit(5),
    ]);

  const now = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(now.getDate() + 30);

  const upcomingPolicies = await LICPolicy.find({
    userId,
    nextDueDate: { $gte: now, $lte: thirtyDaysFromNow },
  }).sort({ nextDueDate: 1 });

  const formattedUpcomingPolicies = upcomingPolicies.map((p) => ({
    _id: p._id,
    policyName: p.policyName,
    premiumAmount: p.premiumAmount,
    nextDueDate: p.nextDueDate,
    lastPaidDate: p.lastPaidDate,
    premiumMode: p.premiumMode,
  }));

  const user = await User.findById(userId);
  const financialGoal = user?.preferences?.monthlyGoal || 0;
  const smartSuggestions = generateSmartSuggestions({
    totalExpenses,
    totalSavings,
    investmentPerformance,
    upcomingLICPayments: formattedUpcomingPolicies,
    recentActivity: {
      expenses: recentExpenses,
      savings: recentSavings,
      investments: recentInvestments,
      policies: recentPolicies,
    },
    trends: {
      expenses: monthlyExpenses,
      savings: monthlySavings,
      investments: monthlyInvestments,
    },
    financialGoal
  });

  return {
    totalExpenses,
    totalInvested,
    totalCurrentValue,
    totalPremium,
    totalSavings,
    investmentPerformance: {
      gainOrLoss: investmentPerformance.gainOrLoss,
      returnPercentage: Number(
        investmentPerformance.returnPercentage.toFixed(2)
      ),
    },
    trends: {
      expenses: monthlyExpenses,
      savings: monthlySavings,
      investments: monthlyInvestments,
    },
    categoryBreakdown: categoryBreakdown || [],
    recentActivity: {
      expenses: recentExpenses,
      savings: recentSavings,
      investments: recentInvestments,
      policies: recentPolicies,
    },
    upcomingLICPayments: formattedUpcomingPolicies,
    smartSuggestions,

  };
};
