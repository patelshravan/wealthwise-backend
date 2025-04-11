const mongoose = require('mongoose');

const LoginActivitySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ipAddress: String,
    device: String,
    browser: String,
    location: String,
    loggedInAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('LoginActivity', LoginActivitySchema);