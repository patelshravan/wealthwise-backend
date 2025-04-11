const Expense = require('../models/Expense');
const Investment = require('../models/Investment');
const LICPolicy = require('../models/LICPolicy');
const LoginActivity = require('../models/LoginActivity');
const Savings = require('../models/Savings');
const User = require('../models/User');
const { uploadImageToCloudinary } = require('../utils/spaceUpload');
const fs = require('fs');
const bcrypt = require("bcryptjs");

// Get user by ID
const getUserById = (id) => User.findById(id);

// Update user by ID (returns the updated document)
const updateUserById = async (id, data, file) => {
    const allowedFields = ["name", "email", "mobile", "bio"];
    const updateData = {};

    for (const field of allowedFields) {
        if (data[field] !== undefined) {
            updateData[field] = data[field];
        }
    }

    if (file) {
        const imageUrl = await uploadImageToCloudinary(file.path);
        updateData.profileImage = imageUrl;
        fs.unlinkSync(file.path);
    }

    return await User.findByIdAndUpdate(id, updateData, { new: true });
};

// Delete user by ID
const deleteUserById = (id) => User.findByIdAndDelete(id);

// Get all users
const getAllUsers = () => User.find();

const updatePreferences = async (userId, preferences) => {
    const user = await User.findById(userId);
    if (!user) {
        return { status: 404, message: "User not found" };
    }

    user.preferences = { ...user.preferences, ...preferences };
    const updatedUser = await user.save();

    return {
        status: 200,
        message: "Preferences updated successfully",
        data: updatedUser.preferences,
    };
};

const checkPassword = async (userId, password) => {
    const user = await User.findById(userId).select("+password");
    if (!user) return false;
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch;
};

const deleteUserAccount = async (userId) => {
    try {
        await Promise.all([
            Expense.deleteMany({ userId }),
            Investment.deleteMany({ userId }),
            LICPolicy.deleteMany({ userId }),
            Savings.deleteMany({ userId }),
            LoginActivity.deleteMany({ userId }),
        ]);

        await User.findByIdAndDelete(userId);

        return { success: true };
    } catch (error) {
        console.error("Error deleting user account:", error);
        return { success: false, message: "An error occurred while deleting the account." };
    }
};

module.exports = {
    getUserById,
    updateUserById,
    deleteUserById,
    getAllUsers,
    updatePreferences,
    checkPassword,
    deleteUserAccount
};
