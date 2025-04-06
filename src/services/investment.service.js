const Investment = require('../models/investment');
const CONSTANTS = require('../config/constant');

const createInvestment = async (data) => {
    try {
        const investment = await Investment.create(data);
        return { status: CONSTANTS.SUCCESSFUL, data: investment, message: CONSTANTS.INVESTMENT_CREATE };
    } catch (error) {
        console.error('Error in createInvestment service:', error);
        return { status: CONSTANTS.INTERNAL_SERVER_ERROR, message: CONSTANTS.INTERNAL_SERVER_ERROR_MSG };
    }
};

const getInvestmentsByUser = async (userId) => {
    try {
        const investments = await Investment.find({ userId })
            .populate('userId', 'name email');
        return { status: CONSTANTS.SUCCESSFUL, data: investments, message: CONSTANTS.INVESTMENT_FETCH };
    } catch (error) {
        console.error('Error in getInvestmentsByUser service:', error);
        return { status: CONSTANTS.INTERNAL_SERVER_ERROR, message: CONSTANTS.INTERNAL_SERVER_ERROR_MSG };
    }
};

const updateInvestment = async (id, data) => {
    try {
        const investment = await Investment.findByIdAndUpdate(id, data, { new: true });
        if (!investment) {
            return { status: CONSTANTS.NOT_FOUND, message: CONSTANTS.INVESTMENT_NOT_FOUND };
        }
        return { status: CONSTANTS.SUCCESSFUL, data: investment, message: CONSTANTS.INVESTMENT_UPDATED };
    } catch (error) {
        console.error('Error in updateInvestment service:', error);
        return { status: CONSTANTS.INTERNAL_SERVER_ERROR, message: CONSTANTS.INTERNAL_SERVER_ERROR_MSG };
    }
};

const deleteInvestment = async (id) => {
    try {
        const investment = await Investment.findByIdAndDelete(id);
        if (!investment) {
            return { status: CONSTANTS.NOT_FOUND, message: CONSTANTS.INVESTMENT_NOT_FOUND };
        }
        return { status: CONSTANTS.SUCCESSFUL, message: CONSTANTS.INVESTMENT_DELETE };
    } catch (error) {
        console.error('Error in deleteInvestment service:', error);
        return { status: CONSTANTS.INTERNAL_SERVER_ERROR, message: CONSTANTS.INTERNAL_SERVER_ERROR_MSG };
    }
};

module.exports = {
    createInvestment,
    getInvestmentsByUser,
    updateInvestment,
    deleteInvestment,
};
