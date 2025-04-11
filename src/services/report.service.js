const Expense = require("../models/Expense");
const Investment = require("../models/Investment");
const LICPolicy = require("../models/LICPolicy");
const Savings = require("../models/Savings");

const generateUserTaxReportData = async (userId) => {
    const [expenses, investments, policies, savings] = await Promise.all([
        Expense.find({ userId }).sort({ date: -1 }),
        Investment.find({ userId }).sort({ startDate: -1 }),
        LICPolicy.find({ userId }).sort({ dueDate: -1 }),
        Savings.find({ userId }).sort({ date: -1 }),
    ]);

    return {
        expenses,
        investments,
        policies,
        savings,
    };
};

module.exports = { generateUserTaxReportData }