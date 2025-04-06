const licService = require('../services/lic.service');
const catchAsync = require('../utils/catchAsync');
const CONSTANTS = require('../config/constant');

const createPolicy = catchAsync(async (req, res) => {
    req.body.userId = req.user._id;

    const result = await licService.createPolicy(req.body);
    if (result.status !== CONSTANTS.SUCCESSFUL) {
        return res.status(result.status).json({ message: result.message });
    }
    res.status(result.status).json({ message: result.message, data: result.data });
});

const getPolicies = catchAsync(async (req, res) => {
    const result = await licService.getPoliciesByUser(req.user._id);
    if (result.status !== CONSTANTS.SUCCESSFUL) {
        return res.status(result.status).json({ message: result.message });
    }
    res.status(result.status).json({ message: result.message, data: result.data });
});

const updatePolicy = catchAsync(async (req, res) => {
    const result = await licService.updatePolicy(req.params.id, req.body);
    if (result.status !== CONSTANTS.SUCCESSFUL) {
        return res.status(result.status).json({ message: result.message });
    }
    res.status(result.status).json({ message: result.message, data: result.data });
});

const deletePolicy = catchAsync(async (req, res) => {
    const result = await licService.deletePolicy(req.params.id);
    if (result.status !== CONSTANTS.SUCCESSFUL) {
        return res.status(result.status).json({ message: result.message });
    }
    res.status(result.status).json({ message: result.message });
});

module.exports = { createPolicy, getPolicies, updatePolicy, deletePolicy };
