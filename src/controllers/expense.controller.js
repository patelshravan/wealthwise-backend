const expenseService = require('../services/expense.service');
const catchAsync = require('../utils/catchAsync');
const CONSTANTS = require('../config/constant');

const createExpense = catchAsync(async (req, res) => {
    req.body.userId = req.user._id;

    const result = await expenseService.createExpense(req.body);
    if (result.status !== CONSTANTS.SUCCESSFUL) {
        return res.status(result.status).json({ message: result.message });
    }
    res.status(result.status).json({ message: CONSTANTS.EXPENSE_CREATE, data: result.data });
});

const getExpenses = catchAsync(async (req, res) => {
    const result = await expenseService.getExpensesByUser(req.user._id);
    if (result.status !== CONSTANTS.SUCCESSFUL) {
        return res.status(result.status).json({ message: result.message });
    }
    res.status(result.status).json({ message: CONSTANTS.EXPENSE_FETCH, data: result.data });
});

const updateExpense = catchAsync(async (req, res) => {
    const result = await expenseService.updateExpense(req.params.id, req.body);
    if (result.status !== CONSTANTS.SUCCESSFUL) {
        return res.status(result.status).json({ message: result.message });
    }
    res.status(result.status).json({ message: CONSTANTS.EXPENSE_UPDATE, data: result.data });
});

const deleteExpense = catchAsync(async (req, res) => {
    const result = await expenseService.deleteExpense(req.params.id);
    if (result.status !== CONSTANTS.SUCCESSFUL) {
        return res.status(result.status).json({ message: result.message });
    }
    res.status(result.status).json({ message: result.message });
});

module.exports = { createExpense, getExpenses, deleteExpense, updateExpense };