const Expense = require('../models/Expense');
const Investment = require('../models/Investment');
const LICPolicy = require('../models/LICPolicy');
const LoginActivity = require('../models/LoginActivity');
const Savings = require('../models/Savings');
const User = require('../models/User');
const { uploadImageToCloudinary } = require('../utils/spaceUpload');
const fs = require('fs');
const bcrypt = require("bcryptjs");
const { sendEmailUpdateOtp } = require('../utils/sendEmail');

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

// Step 1: Request OTP for Email Update
const requestEmailUpdate = async (userId, newEmail) => {
    const user = await User.findById(userId);
    if (!user) return { success: false, message: "User not found" };

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.pendingEmail = newEmail;
    user.emailUpdateOTP = otp;
    user.emailUpdateExpires = expiry;

    await user.save();

    await sendEmailUpdateOtp(newEmail, user.name, otp);
    return { success: true, message: "OTP sent to new email." };
};

// Step 2: Verify OTP and update email
const verifyAndUpdateEmail = async (userId, otp) => {
    const user = await User.findById(userId);
    if (!user || !user.pendingEmail) return { success: false, message: "No pending email update" };

    if (user.emailUpdateOTP !== otp || user.emailUpdateExpires < Date.now()) {
        return { success: false, message: "Invalid or expired OTP" };
    }

    user.email = user.pendingEmail;
    user.pendingEmail = null;
    user.emailUpdateOTP = null;
    user.emailUpdateExpires = null;

    await user.save();

    return { success: true, message: "Email updated successfully", data: user };
};

module.exports = {
    getUserById,
    updateUserById,
    deleteUserById,
    getAllUsers,
    updatePreferences,
    checkPassword,
    deleteUserAccount,
    requestEmailUpdate,
    verifyAndUpdateEmail
};
