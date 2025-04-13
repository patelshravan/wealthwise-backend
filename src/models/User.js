const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    profileImage: String,
    mobile: String,
    bio: String,
    isVerified: { type: Boolean, default: false },
    pendingEmail: String,
    emailUpdateOTP: String,
    emailUpdateExpires: Date,
    emailOTP: String,
    emailOTPExpires: Date,
    passwordResetOTP: String,
    passwordResetExpires: Date,
    preferences: {
        country: { type: String, default: 'India' },
        currency: { type: String, default: 'INR' },
        dateFormat: { type: String, default: 'DD/MM/YYYY' },
        theme: { type: String, enum: ['light', 'dark'], default: 'light' },
        monthlyGoal: { type: Number, default: 0 },
    },
}, { timestamps: true });

// Hash password before save
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
