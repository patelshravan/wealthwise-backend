const incomeService = require("../services/income.service");
const catchAsync = require("../utils/catchAsync");
const CONSTANTS = require("../config/constant");

const createIncome = catchAsync(async (req, res) => {
    req.body.userId = req.user._id;
    const result = await incomeService.createIncome(req.body);
    if (result.status !== CONSTANTS.SUCCESSFUL) {
        return res.status(result.status).json({ message: result.message });
    }
    res
        .status(result.status)
        .json({ message: "Income created successfully", data: result.data });
});

const getIncome = catchAsync(async (req, res) => {
    const { search = "", page = 1, limit = 10 } = req.query;
    const result = await incomeService.getIncomeByUser(
        req.user._id,
        search,
        page,
        limit
    );
    if (result.status !== CONSTANTS.SUCCESSFUL) {
        return res.status(result.status).json({ message: result.message });
    }
    res
        .status(result.status)
        .json({ message: "Income fetched successfully", data: result.data, pages: result.pages });
});

const updateIncome = catchAsync(async (req, res) => {
    const result = await incomeService.updateIncome(req.params.id, req.body);
    if (result.status !== CONSTANTS.SUCCESSFUL) {
        return res.status(result.status).json({ message: result.message });
    }
    res
        .status(result.status)
        .json({ message: result.message, data: result.data });
});

const deleteIncome = catchAsync(async (req, res) => {
    const result = await incomeService.deleteIncome(req.params.id);
    if (result.status !== CONSTANTS.SUCCESSFUL) {
        return res.status(result.status).json({ message: result.message });
    }
    res.status(result.status).json({ message: result.message });
});

module.exports = { createIncome, getIncome, updateIncome, deleteIncome };

