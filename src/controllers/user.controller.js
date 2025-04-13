const userService = require('../services/user.service');
const catchAsync = require('../utils/catchAsync');
const CONSTANTS = require('../config/constant');

// Get user profile by ID
const getUserProfile = catchAsync(async (req, res) => {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
        return res.status(CONSTANTS.NOT_FOUND).json({ error: CONSTANTS.USER_NOT_FOUND });
    }
    res.status(CONSTANTS.SUCCESSFUL).json({ message: CONSTANTS.USER_FETCH, data: user });
});

// Update user profile by ID
const updateUserProfile = catchAsync(async (req, res) => {
    const updatedUser = await userService.updateUserById(req.params.id, req.body, req.file);

    if (!updatedUser) {
        return res.status(CONSTANTS.NOT_FOUND).json({ error: CONSTANTS.USER_NOT_FOUND });
    }

    res.status(CONSTANTS.SUCCESSFUL).json({ message: CONSTANTS.USER_UPDATED, data: updatedUser });
});

// Delete user by ID
const deleteUserProfile = catchAsync(async (req, res) => {
    const deletedUser = await userService.deleteUserById(req.params.id);
    if (!deletedUser) {
        return res.status(CONSTANTS.NOT_FOUND).json({ error: CONSTANTS.USER_NOT_FOUND });
    }
    res.status(CONSTANTS.SUCCESSFUL).json({ message: CONSTANTS.USER_DELETE });
});

// Get all users
const getAllUsers = catchAsync(async (req, res) => {
    const users = await userService.getAllUsers();
    res.status(CONSTANTS.SUCCESSFUL).json({ message: CONSTANTS.USER_FETCH, data: users });
});

const updateUserPreferences = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const preferences = req.body;

    const result = await userService.updatePreferences(userId, preferences);
    res.status(result.status).json({ message: result.message, data: result.data });
});

const verifyPasswordBeforeDelete = catchAsync(async (req, res) => {
    try {
        const userId = req.user._id;
        const { password } = req.body;
        const isValid = await userService.checkPassword(userId, password);

        if (!isValid) {
            return res.status(400).json({ success: false, message: "Invalid password" });
        }

        res.json({ success: true });
    } catch (err) {
        console.error("Password verify error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

const deleteAccount = catchAsync(async (req, res) => {
    const userId = req.user._id;

    const result = await userService.deleteUserAccount(userId);

    if (result.success) {
        res.json({ message: "Account deleted successfully." });
    } else {
        res.status(500).json({ message: result.message || "Failed to delete account." });
    }
});

const requestEmailUpdate = catchAsync(async (req, res) => {
    const { newEmail } = req.body;
    const userId = req.user._id;

    const result = await userService.requestEmailUpdate(userId, newEmail);
    res.status(result.success ? 200 : 400).json(result);
});

const verifyEmailUpdate = catchAsync(async (req, res) => {
    const { otp } = req.body;
    const userId = req.user._id;

    const result = await userService.verifyAndUpdateEmail(userId, otp);
    res.status(result.success ? 200 : 400).json(result);
});

module.exports = {
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
    getAllUsers,
    updateUserPreferences,
    verifyPasswordBeforeDelete,
    deleteAccount,
    requestEmailUpdate,
    verifyEmailUpdate
};
