const Investment = require("../models/Investment");
const CONSTANTS = require("../config/constant");

const createInvestment = async (data) => {
  try {
    const investment = await Investment.create(data);
    return {
      status: CONSTANTS.SUCCESSFUL,
      data: investment,
      message: CONSTANTS.INVESTMENT_CREATE,
    };
  } catch (error) {
    console.error("Error in createInvestment service:", error);
    return {
      status: CONSTANTS.INTERNAL_SERVER_ERROR,
      message: CONSTANTS.INTERNAL_SERVER_ERROR_MSG,
    };
  }
};

const getInvestmentsByUser = async (
  userId,
  search = "",
  page = 1,
  limit = 10
) => {
  try {
    const query = {
      userId,
      $or: [{ name: { $regex: search, $options: "i" } }],
    };

    const options = {
      page,
      limit,
      sort: { date: -1 },
    };

    const result = await Investment.paginate(query, options);

    return {
      status: CONSTANTS.SUCCESSFUL,
      data: result.docs,
      total: result.totalDocs,
      page: result.page,
      pages: result.totalPages,
    };
  } catch (error) {
    console.error("Error in getInvestmentsByUser service:", error);
    return {
      status: CONSTANTS.INTERNAL_SERVER_ERROR,
      message: CONSTANTS.INTERNAL_SERVER_ERROR_MSG,
    };
  }
};

const updateInvestment = async (id, data) => {
  try {
    const investment = await Investment.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!investment) {
      return {
        status: CONSTANTS.NOT_FOUND,
        message: CONSTANTS.INVESTMENT_NOT_FOUND,
      };
    }
    return {
      status: CONSTANTS.SUCCESSFUL,
      data: investment,
      message: CONSTANTS.INVESTMENT_UPDATED,
    };
  } catch (error) {
    console.error("Error in updateInvestment service:", error);
    return {
      status: CONSTANTS.INTERNAL_SERVER_ERROR,
      message: CONSTANTS.INTERNAL_SERVER_ERROR_MSG,
    };
  }
};

const deleteInvestment = async (id) => {
  try {
    const investment = await Investment.findByIdAndDelete(id);
    if (!investment) {
      return {
        status: CONSTANTS.NOT_FOUND,
        message: CONSTANTS.INVESTMENT_NOT_FOUND,
      };
    }
    return {
      status: CONSTANTS.SUCCESSFUL,
      message: CONSTANTS.INVESTMENT_DELETE,
    };
  } catch (error) {
    console.error("Error in deleteInvestment service:", error);
    return {
      status: CONSTANTS.INTERNAL_SERVER_ERROR,
      message: CONSTANTS.INTERNAL_SERVER_ERROR_MSG,
    };
  }
};

module.exports = {
  createInvestment,
  getInvestmentsByUser,
  updateInvestment,
  deleteInvestment,
};
