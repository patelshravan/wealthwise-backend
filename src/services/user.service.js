const User = require('../models/User');

// Get user by ID
const getUserById = (id) => User.findById(id);

// Update user by ID (returns the updated document)
const updateUserById = (id, data) => User.findByIdAndUpdate(id, data, { new: true });

// Delete user by ID
const deleteUserById = (id) => User.findByIdAndDelete(id);

// Get all users
const getAllUsers = () => User.find();

module.exports = {
    getUserById,
    updateUserById,
    deleteUserById,
    getAllUsers,
};
