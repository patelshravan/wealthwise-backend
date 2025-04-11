const Expense = require("../models/Expense");
const CONSTANTS = require("../config/constant");
const { uploadImageToCloudinary } = require("../utils/spaceUpload");
const fs = require("fs");

const createExpense = async (data, file) => {
  try {
    const allowedFields = ["userId", "amount", "category", "note", "date"];
    const expenseData = {};

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        expenseData[field] = data[field];
      }
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
      select: "userId amount category note date image createdAt",
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
    const allowedFields = ["amount", "category", "note", "date", "image"];
    const updateData = {};

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
      }
    }

    if (file) {
      const imageUrl = await uploadImageToCloudinary(file.path);
      updateData.image = imageUrl;
      fs.unlinkSync(file.path);
    }

    const expense = await Expense.findByIdAndUpdate(id, updateData, {
      new: true,
    });
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
