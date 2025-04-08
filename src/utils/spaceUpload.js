const cloudinary = require('cloudinary').v2;
const config = require('../config/config');

cloudinary.config({
    cloud_name: config.cloudinary.cloud_name,
    api_key: config.cloudinary.api_key,
    api_secret: config.cloudinary.api_secret,
});

const uploadImageToCloudinary = async (filePath, folder = 'wealthwise') => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: folder
        });
        return result.secure_url;
    } catch (error) {
        console.error('Cloudinary upload failed:', error);
        throw error;
    }
};

module.exports = { uploadImageToCloudinary };
