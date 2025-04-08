const Expense = require("../models/Expense");
const Investment = require("../models/Investment");
const LICPolicy = require("../models/LICPolicy");
const Savings = require("../models/Savings");

exports.getUserDashboardData = async (userId) => {
  const [expenses, investments, policies, savings] = await Promise.all([
    Expense.aggregate([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),

    Investment.aggregate([
      { $match: { userId } },
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
      { $match: { userId } },
      { $group: { _id: null, totalSavings: { $sum: "$amount" } } },
    ]),
  ]);

  return {
    totalExpenses: expenses[0]?.total || 0,
    totalInvested: investments[0]?.totalInvested || 0,
    totalCurrentValue: investments[0]?.totalCurrentValue || 0,
    totalPremium: policies[0]?.totalPremium || 0,
    totalSavings: savings[0]?.totalSavings || 0,
  };
};
