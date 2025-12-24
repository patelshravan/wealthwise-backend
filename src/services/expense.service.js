const Expense = require("../models/Expense");
const CONSTANTS = require("../config/constant");
const { uploadImageToCloudinary } = require("../utils/spaceUpload");
const fs = require("fs");

const createExpense = async (data, file) => {
  try {
    const allowedFields = ["userId", "amount", "category", "note", "date", "isCreditCard", "cardName", "paymentStatus", "dueDate", "billingCycleDate", "isReimbursable", "expectedReimbursement", "reimbursementReceived"];
    const expenseData = {};

    for (const field of allowedFields) {
      // Handle boolean fields - they should be processed even if empty/false
      if (field === "isCreditCard" || field === "isReimbursable" || field === "reimbursementReceived") {
        if (data[field] !== undefined && data[field] !== null) {
          expenseData[field] = data[field] === true || data[field] === "true" || data[field] === "1";
        }
      } else if (field === "expectedReimbursement") {
        // Allow 0 as a valid value
        if (data[field] !== undefined && data[field] !== null && data[field] !== "") {
          expenseData[field] = parseFloat(data[field]) || 0;
        }
      } else if (data[field] !== undefined && data[field] !== null && data[field] !== "") {
        expenseData[field] = data[field];
      }
    }

    // If isCreditCard is false, clear credit card related fields
    if (expenseData.isCreditCard === false) {
      expenseData.cardName = "";
      expenseData.paymentStatus = "pending";
      expenseData.dueDate = undefined;
    }

    // If user didn't provide a date, use current date
    if (!expenseData.date) {
      expenseData.date = new Date();
    }

    if (file) {
      const imageUrl = await uploadImageToCloudinary(file.path);
      expenseData.image = imageUrl;
      fs.unlinkSync(file.path);
    }

    const expense = await Expense.create(expenseData);
    return { status: CONSTANTS.SUCCESSFUL, data: expense };
  } catch (error) {
    console.error("Error in createExpense service:", error);
    return {
      status: CONSTANTS.INTERNAL_SERVER_ERROR,
      message: CONSTANTS.INTERNAL_SERVER_ERROR_MSG,
    };
  }
};

const getExpensesByUser = async (userId, search = "", page = 1, limit = 10) => {
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
      select: "userId amount category note date image isCreditCard cardName paymentStatus dueDate billingCycleDate isReimbursable expectedReimbursement reimbursementReceived createdAt updatedAt",
    };

    const result = await Expense.paginate(query, options);

    return {
      status: CONSTANTS.SUCCESSFUL,
      data: result.docs,
      total: result.totalDocs,
      page: result.page,
      pages: result.totalPages,
    };
  } catch (error) {
    console.error("Error in getExpensesByUser service:", error);
    return {
      status: CONSTANTS.INTERNAL_SERVER_ERROR,
      message: CONSTANTS.INTERNAL_SERVER_ERROR_MSG,
    };
  }
};

const updateExpense = async (id, data, file) => {
  try {
    // Ensure data is an object
    if (!data || typeof data !== "object") {
      data = {};
    }

    const allowedFields = ["amount", "category", "note", "date", "image", "isCreditCard", "cardName", "paymentStatus", "dueDate", "billingCycleDate", "isReimbursable", "expectedReimbursement", "reimbursementReceived"];
    const updateData = {};

    // Get the existing expense first to preserve credit card fields if not being changed
    const existingExpense = await Expense.findById(id).select("+isCreditCard +cardName +paymentStatus +dueDate +billingCycleDate +isReimbursable +expectedReimbursement +reimbursementReceived");

    // Always handle isCreditCard first - use safer property check
    if (data !== null && data !== undefined && Object.prototype.hasOwnProperty.call(data, "isCreditCard")) {
      updateData.isCreditCard = data.isCreditCard === true || data.isCreditCard === "true" || data.isCreditCard === "1";

      // If isCreditCard is being set to false, clear credit card related fields
      if (updateData.isCreditCard === false) {
        updateData.cardName = "";
        updateData.paymentStatus = "pending";
        updateData.dueDate = undefined;
      } else {
        // If isCreditCard is true, preserve existing values if not provided
        if (!Object.prototype.hasOwnProperty.call(data, "cardName")) {
          updateData.cardName = existingExpense?.cardName || "";
        }
        if (!Object.prototype.hasOwnProperty.call(data, "paymentStatus")) {
          updateData.paymentStatus = existingExpense?.paymentStatus || "pending";
        }
        if (!Object.prototype.hasOwnProperty.call(data, "dueDate") && existingExpense?.dueDate) {
          updateData.dueDate = existingExpense.dueDate;
        }
      }
    } else if (existingExpense?.isCreditCard === true) {
      // If isCreditCard is not being changed but expense is a credit card expense,
      // preserve the isCreditCard status and all credit card fields
      updateData.isCreditCard = true;
      if (!Object.prototype.hasOwnProperty.call(data, "cardName") && existingExpense?.cardName) {
        updateData.cardName = existingExpense.cardName;
      }
      if (!Object.prototype.hasOwnProperty.call(data, "paymentStatus") && existingExpense?.paymentStatus) {
        updateData.paymentStatus = existingExpense.paymentStatus;
      }
      if (!Object.prototype.hasOwnProperty.call(data, "dueDate") && existingExpense?.dueDate) {
        updateData.dueDate = existingExpense.dueDate;
      }
    }

    // Handle other fields
    for (const field of allowedFields) {
      if (field === "isCreditCard") continue; // Already handled above

      if (data[field] !== undefined && data[field] !== null) {
        // Handle credit card fields specially
        if (field === "cardName" || field === "paymentStatus" || field === "dueDate") {
          const isCC = updateData.isCreditCard !== undefined ? updateData.isCreditCard : (existingExpense?.isCreditCard === true);
          if (isCC) {
            // Only update if a value is provided, otherwise preserve existing
            if (data[field] !== undefined && data[field] !== null && data[field] !== "") {
              updateData[field] = data[field];
            } else if (!Object.prototype.hasOwnProperty.call(updateData, field) && existingExpense?.[field]) {
              // Preserve existing value if not being updated
              updateData[field] = existingExpense[field];
            }
          }
        } else if (data[field] !== "") {
          updateData[field] = data[field];
        }
      }
    }

    if (file) {
      const imageUrl = await uploadImageToCloudinary(file.path);
      updateData.image = imageUrl;
      fs.unlinkSync(file.path);
    }

    const expense = await Expense.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        select: "userId amount category note date image isCreditCard cardName paymentStatus dueDate billingCycleDate isReimbursable expectedReimbursement reimbursementReceived createdAt updatedAt",
      }
    );

    if (!expense) {
      return {
        status: CONSTANTS.NOT_FOUND,
        message: CONSTANTS.EXPENSE_NOT_FOUND,
      };
    }

    return {
      status: CONSTANTS.SUCCESSFUL,
      data: expense,
      message: CONSTANTS.EXPENSE_UPDATE,
    };
  } catch (error) {
    console.error("Error in updateExpense service:", error);
    return {
      status: CONSTANTS.INTERNAL_SERVER_ERROR,
      message: CONSTANTS.INTERNAL_SERVER_ERROR_MSG,
    };
  }
};

const deleteExpense = async (id) => {
  try {
    const expense = await Expense.findByIdAndDelete(id);
    if (!expense) {
      return {
        status: CONSTANTS.NOT_FOUND,
        message: CONSTANTS.EXPENSE_NOT_FOUND,
      };
    }
    return { status: CONSTANTS.SUCCESSFUL, message: CONSTANTS.EXPENSE_DELETE };
  } catch (error) {
    console.error("Error in deleteExpense service:", error);
    return {
      status: CONSTANTS.INTERNAL_SERVER_ERROR,
      message: CONSTANTS.INTERNAL_SERVER_ERROR_MSG,
    };
  }
};

module.exports = {
  createExpense,
  getExpensesByUser,
  updateExpense,
  deleteExpense,
};
