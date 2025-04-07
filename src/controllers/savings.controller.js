const savingsService = require('../services/savings.service');
const catchAsync = require('../utils/catchAsync');
const CONSTANTS = require('../config/constant');

const createSavings = catchAsync(async (req, res) => {
    req.body.userId = req.user._id;
    const result = await savingsService.createSavings(req.body);
    if (result.status !== CONSTANTS.SUCCESSFUL) {
        return res.status(result.status).json({ message: result.message });
    }
    res.status(result.status).json({ message: CONSTANTS.SAVINGS_CREATE, data: result.data });
});

const getSavings = catchAsync(async (req, res) => {
    const result = await savingsService.getSavingsByUser(req.user._id);
    if (result.status !== CONSTANTS.SUCCESSFUL) {
        return res.status(result.status).json({ message: result.message });
    }
    res.status(result.status).json({ message: CONSTANTS.SAVINGS_FETCH, data: result.data });
});

const updateSavings = catchAsync(async (req, res) => {
    const result = await savingsService.updateSavings(req.params.id, req.body);
    if (result.status !== CONSTANTS.SUCCESSFUL) {
        return res.status(result.status).json({ message: result.message });
    }
    res.status(result.status).json({ message: CONSTANTS.SAVINGS_UPDATE, data: result.data });
});

const deleteSavings = catchAsync(async (req, res) => {
    const result = await savingsService.deleteSavings(req.params.id);
    if (result.status !== CONSTANTS.SUCCESSFUL) {
        return res.status(result.status).json({ message: result.message });
    }
    res.status(result.status).json({ message: result.message });
});

module.exports = { createSavings, getSavings, updateSavings, deleteSavings };
