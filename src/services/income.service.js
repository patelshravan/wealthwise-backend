const Income = require("../models/Income");
const CONSTANTS = require("../config/constant");

const createIncome = async (data) => {
    try {
        const allowedFields = ["userId", "amount", "category", "note", "date", "source"];
        const incomeData = {};

        for (const field of allowedFields) {
            if (data[field] !== undefined && data[field] !== null && data[field] !== "") {
                incomeData[field] = data[field];
            }
        }

        // If user didn't provide a date, use current date
        if (!incomeData.date) {
            incomeData.date = new Date();
        }

        const income = await Income.create(incomeData);
        return { status: CONSTANTS.SUCCESSFUL, data: income };
    } catch (error) {
        console.error("Error in createIncome service:", error);
        return {
            status: CONSTANTS.INTERNAL_SERVER_ERROR,
            message: CONSTANTS.INTERNAL_SERVER_ERROR_MSG,
        };
    }
};

const getIncomeByUser = async (userId, search = "", page = 1, limit = 10) => {
    try {
        const query = {
            userId,
            $or: [
                { category: { $regex: search, $options: "i" } },
                { note: { $regex: search, $options: "i" } },
            ],
        };

        const options = {
            page,
            limit,
            sort: { createdAt: -1 },
        };

        const result = await Income.paginate(query, options);

        return {
            status: CONSTANTS.SUCCESSFUL,
            data: result.docs,
            total: result.totalDocs,
            page: result.page,
            pages: result.totalPages,
        };
    } catch (error) {
        console.error("Error in getIncomeByUser service:", error);
        return {
            status: CONSTANTS.INTERNAL_SERVER_ERROR,
            message: CONSTANTS.INTERNAL_SERVER_ERROR_MSG,
        };
    }
};

const updateIncome = async (id, data) => {
    try {
        const income = await Income.findByIdAndUpdate(id, data, { new: true });
        if (!income) {
            return {
                status: CONSTANTS.NOT_FOUND,
                message: "Income not found",
            };
        }
        return {
            status: CONSTANTS.SUCCESSFUL,
            data: income,
            message: "Income updated successfully",
        };
    } catch (error) {
        console.error("Error in updateIncome service:", error);
        return {
            status: CONSTANTS.INTERNAL_SERVER_ERROR,
            message: CONSTANTS.INTERNAL_SERVER_ERROR_MSG,
        };
    }
};

const deleteIncome = async (id) => {
    try {
        const income = await Income.findByIdAndDelete(id);
        if (!income) {
            return {
                status: CONSTANTS.NOT_FOUND,
                message: "Income not found",
            };
        }
        return { status: CONSTANTS.SUCCESSFUL, message: "Income deleted successfully" };
    } catch (error) {
        console.error("Error in deleteIncome service:", error);
        return {
            status: CONSTANTS.INTERNAL_SERVER_ERROR,
            message: CONSTANTS.INTERNAL_SERVER_ERROR_MSG,
        };
    }
};

module.exports = {
    createIncome,
    getIncomeByUser,
    updateIncome,
    deleteIncome,
};

