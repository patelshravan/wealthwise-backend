const LICPolicy = require('../models/LICPolicy');
const CONSTANTS = require('../config/constant');

const createPolicy = async (data) => {
    try {
        const policy = await LICPolicy.create(data);
        return { status: CONSTANTS.SUCCESSFUL, data: policy, message: CONSTANTS.LIC_CREATE };
    } catch (error) {
        console.error('Error in createPolicy service:', error);
        return { status: CONSTANTS.INTERNAL_SERVER_ERROR, message: CONSTANTS.INTERNAL_SERVER_ERROR_MSG };
    }
};

const getPoliciesByUser = async (userId) => {
    try {
        const policies = await LICPolicy.find({ userId })
            .populate('userId', 'name email');
        return { status: CONSTANTS.SUCCESSFUL, data: policies, message: CONSTANTS.LIC_FETCH };
    } catch (error) {
        console.error('Error in getPoliciesByUser service:', error);
        return { status: CONSTANTS.INTERNAL_SERVER_ERROR, message: CONSTANTS.INTERNAL_SERVER_ERROR_MSG };
    }
};

const updatePolicy = async (id, data) => {
    try {
        const policy = await LICPolicy.findByIdAndUpdate(id, data, { new: true });
        if (!policy) {
            return { status: CONSTANTS.NOT_FOUND, message: CONSTANTS.LIC_NOT_FOUND };
        }
        return { status: CONSTANTS.SUCCESSFUL, data: policy, message: CONSTANTS.LIC_UPDATED };
    } catch (error) {
        console.error('Error in updatePolicy service:', error);
        return { status: CONSTANTS.INTERNAL_SERVER_ERROR, message: CONSTANTS.INTERNAL_SERVER_ERROR_MSG };
    }
};

const deletePolicy = async (id) => {
    try {
        const policy = await LICPolicy.findByIdAndDelete(id);
        if (!policy) {
            return { status: CONSTANTS.NOT_FOUND, message: CONSTANTS.LIC_NOT_FOUND };
        }
        return { status: CONSTANTS.SUCCESSFUL, message: CONSTANTS.LIC_DELETE };
    } catch (error) {
        console.error('Error in deletePolicy service:', error);
        return { status: CONSTANTS.INTERNAL_SERVER_ERROR, message: CONSTANTS.INTERNAL_SERVER_ERROR_MSG };
    }
};

module.exports = {
    createPolicy,
    getPoliciesByUser,
    updatePolicy,
    deletePolicy,
};
