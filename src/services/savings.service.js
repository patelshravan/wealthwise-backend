const Savings = require("../models/Savings");
const CONSTANTS = require("../config/constant");

const createSavings = async (data) => {
  try {
    const savings = await Savings.create(data);
    return { status: CONSTANTS.SUCCESSFUL, data: savings };
  } catch (error) {
    console.error("Error in createSavings service:", error);
    return {
      status: CONSTANTS.INTERNAL_SERVER_ERROR,
      message: CONSTANTS.INTERNAL_SERVER_ERROR_MSG,
    };
  }
};

const getSavingsByUser = async (userId, search = "", page = 1, limit = 10) => {
  try {
    const query = {
      userId,
      $or: [{ note: { $regex: search, $options: "i" } }],
    };

    const options = {
      page,
      limit,
      sort: { date: -1 },
    };

    const result = await Savings.paginate(query, options);

    return {
      status: CONSTANTS.SUCCESSFUL,
      data: result.docs,
      total: result.totalDocs,
      page: result.page,
      pages: result.totalPages,
    };
  } catch (error) {
    console.error("Error in getSavingsByUser service:", error);
    return {
      status: CONSTANTS.INTERNAL_SERVER_ERROR,
      message: CONSTANTS.INTERNAL_SERVER_ERROR_MSG,
    };
  }
};

const updateSavings = async (id, data) => {
  try {
    const savings = await Savings.findByIdAndUpdate(id, data, { new: true });
    if (!savings) {
      return {
        status: CONSTANTS.NOT_FOUND,
        message: CONSTANTS.SAVINGS_NOT_FOUND,
      };
    }
    return {
      status: CONSTANTS.SUCCESSFUL,
      data: savings,
      message: CONSTANTS.SAVINGS_UPDATE,
    };
  } catch (error) {
    console.error("Error in updateSavings service:", error);
    return {
      status: CONSTANTS.INTERNAL_SERVER_ERROR,
      message: CONSTANTS.INTERNAL_SERVER_ERROR_MSG,
    };
  }
};

const deleteSavings = async (id) => {
  try {
    const savings = await Savings.findByIdAndDelete(id);
    if (!savings) {
      return {
        status: CONSTANTS.NOT_FOUND,
        message: CONSTANTS.SAVINGS_NOT_FOUND,
      };
    }
    return { status: CONSTANTS.SUCCESSFUL, message: CONSTANTS.SAVINGS_DELETE };
  } catch (error) {
    console.error("Error in deleteSavings service:", error);
    return {
      status: CONSTANTS.INTERNAL_SERVER_ERROR,
      message: CONSTANTS.INTERNAL_SERVER_ERROR_MSG,
    };
  }
};

module.exports = {
  createSavings,
  getSavingsByUser,
  updateSavings,
  deleteSavings,
};
