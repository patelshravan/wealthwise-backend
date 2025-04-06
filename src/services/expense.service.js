const Expense = require('../models/Expense');
const CONSTANTS = require('../config/constant');

const createExpense = async (data) => {
    try {
        const expense = await Expense.create(data);
        return { status: CONSTANTS.SUCCESSFUL, data: expense };
    } catch (error) {
        console.error('Error in createExpense service:', error);
        return { status: CONSTANTS.INTERNAL_SERVER_ERROR, message: CONSTANTS.INTERNAL_SERVER_ERROR_MSG };
    }
};

const getExpensesByUser = async (userId) => {
    try {
        const expenses = await Expense.find({ userId })
            .populate('userId', 'name email');
        return { status: CONSTANTS.SUCCESSFUL, data: expenses };
    } catch (error) {
        console.error('Error in getExpensesByUser service:', error);
        return { status: CONSTANTS.INTERNAL_SERVER_ERROR, message: CONSTANTS.INTERNAL_SERVER_ERROR_MSG };
    }
};

const updateExpense = async (id, data) => {
    try {
        const expense = await Expense.findByIdAndUpdate(id, data, { new: true });
        if (!expense) {
            return { status: CONSTANTS.NOT_FOUND, message: CONSTANTS.EXPENSE_NOT_FOUND };
        }
        return { status: CONSTANTS.SUCCESSFUL, data: expense, message: CONSTANTS.EXPENSE_UPDATE };
    } catch (error) {
        console.error('Error in updateExpense service:', error);
        return { status: CONSTANTS.INTERNAL_SERVER_ERROR, message: CONSTANTS.INTERNAL_SERVER_ERROR_MSG };
    }
};

const deleteExpense = async (id) => {
    try {
        const expense = await Expense.findByIdAndDelete(id);
        if (!expense) {
            return { status: CONSTANTS.NOT_FOUND, message: CONSTANTS.EXPENSE_NOT_FOUND };
        }
        return { status: CONSTANTS.SUCCESSFUL, message: CONSTANTS.EXPENSE_DELETE };
    } catch (error) {
        console.error('Error in deleteExpense service:', error);
        return { status: CONSTANTS.INTERNAL_SERVER_ERROR, message: CONSTANTS.INTERNAL_SERVER_ERROR_MSG };
    }
};

module.exports = {
    createExpense,
    getExpensesByUser,
    updateExpense,
    deleteExpense,
};
