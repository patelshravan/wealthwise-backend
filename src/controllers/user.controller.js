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

module.exports = {
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
    getAllUsers,
};
