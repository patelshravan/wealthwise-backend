const LICPolicy = require("../models/LICPolicy");
const CONSTANTS = require("../config/constant");
const { calculateNextDueDate } = require("../utils/licUtils");

const createPolicy = async (data) => {
  try {
    // Auto-calculate nextDueDate if needed
    if (!data.nextDueDate && data.dueDate && data.premiumMode) {
      data.nextDueDate = calculateNextDueDate(data.dueDate, data.premiumMode);
    }

    const policy = await LICPolicy.create(data);

    return {
      status: CONSTANTS.SUCCESSFUL,
      data: policy,
      message: CONSTANTS.LIC_CREATE,
    };
  } catch (error) {
    console.error("Error in createPolicy service:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return {
        status: 400,
        message: messages.join(", "), // Example: "nextDueDate is required, premiumMode is required"
      };
    }

    return {
      status: CONSTANTS.INTERNAL_SERVER_ERROR,
      message: CONSTANTS.INTERNAL_SERVER_ERROR_MSG,
    };
  }
};

const getPoliciesByUser = async (userId, search = "", page = 1, limit = 10) => {
  try {
    const query = {
      userId,
      $or: [
        { policyNumber: { $regex: search, $options: "i" } },
        { policyName: { $regex: search, $options: "i" } },
        ...(isNaN(search) ? [] : [{ premiumAmount: Number(search) }]), // Only add this if search is a number
      ],
    };

    const options = {
      page,
      limit,
      sort: { date: -1 },
    };

    const result = await LICPolicy.paginate(query, options);

    return {
      status: CONSTANTS.SUCCESSFUL,
      data: result.docs,
      total: result.totalDocs,
      page: result.page,
      pages: result.totalPages,
    };
  } catch (error) {
    console.error("Error in getPoliciesByUser service:", error);
    return {
      status: CONSTANTS.INTERNAL_SERVER_ERROR,
      message: CONSTANTS.INTERNAL_SERVER_ERROR_MSG,
    };
  }
};

const updatePolicy = async (id, data) => {
  try {
    const policy = await LICPolicy.findById(id);
    if (!policy) {
      return { status: CONSTANTS.NOT_FOUND, message: CONSTANTS.LIC_NOT_FOUND };
    }

    // STEP 1: Apply basic updates
    Object.keys(data).forEach((key) => {
      policy[key] = data[key]; // apply all fields, including dueDate & lastPaidDate
    });

    // STEP 2: Recalculate nextDueDate if dueDate and premiumMode exist
    if (policy.dueDate && policy.premiumMode) {
      policy.nextDueDate = calculateNextDueDate(
        policy.dueDate,
        policy.premiumMode
      );
    }

    const updatedPolicy = await policy.save();

    return {
      status: CONSTANTS.SUCCESSFUL,
      data: updatedPolicy,
      message: CONSTANTS.LIC_UPDATED,
    };
  } catch (error) {
    console.error("Error in updatePolicy service:", error);
    return {
      status: CONSTANTS.INTERNAL_SERVER_ERROR,
      message: CONSTANTS.INTERNAL_SERVER_ERROR_MSG,
    };
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
    console.error("Error in deletePolicy service:", error);
    return {
      status: CONSTANTS.INTERNAL_SERVER_ERROR,
      message: CONSTANTS.INTERNAL_SERVER_ERROR_MSG,
    };
  }
};

module.exports = {
  createPolicy,
  getPoliciesByUser,
  updatePolicy,
  deletePolicy,
};
