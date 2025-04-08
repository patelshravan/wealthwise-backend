const User = require('../models/User');
const { uploadImageToCloudinary } = require('../utils/spaceUpload');
const fs = require('fs');

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

module.exports = {
    getUserById,
    updateUserById,
    deleteUserById,
    getAllUsers,
};
