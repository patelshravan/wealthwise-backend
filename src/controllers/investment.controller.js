const investmentService = require('../services/investment.service');
const catchAsync = require('../utils/catchAsync');
const CONSTANTS = require('../config/constant');

const createInvestment = catchAsync(async (req, res) => {
    req.body.userId = req.user._id;

    const result = await investmentService.createInvestment(req.body);
    if (result.status !== CONSTANTS.SUCCESSFUL) {
        return res.status(result.status).json({ message: result.message });
    }
    res.status(result.status).json({ message: result.message, data: result.data });
});

const getInvestments = catchAsync(async (req, res) => {
    const result = await investmentService.getInvestmentsByUser(req.user._id);
    if (result.status !== CONSTANTS.SUCCESSFUL) {
        return res.status(result.status).json({ message: result.message });
    }
    res.status(result.status).json({ message: result.message, data: result.data });
});

const updateInvestment = catchAsync(async (req, res) => {
    const result = await investmentService.updateInvestment(req.params.id, req.body);
    if (result.status !== CONSTANTS.SUCCESSFUL) {
        return res.status(result.status).json({ message: result.message });
    }
    res.status(result.status).json({ message: result.message, data: result.data });
});

const deleteInvestment = catchAsync(async (req, res) => {
    const result = await investmentService.deleteInvestment(req.params.id);
    if (result.status !== CONSTANTS.SUCCESSFUL) {
        return res.status(result.status).json({ message: result.message });
    }
    res.status(result.status).json({ message: result.message });
});

module.exports = {
    createInvestment,
    getInvestments,
    updateInvestment,
    deleteInvestment,
};
