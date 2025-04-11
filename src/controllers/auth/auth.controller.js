const authService = require('../../services/auth/auth.service');
const CONSTANTS = require('../../config/constant');
const catchAsync = require('../../utils/catchAsync');
const LoginActivity = require('../../models/LoginActivity');

const register = catchAsync(async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    const result = await authService.register(name, email, password, confirmPassword);
    res.status(result.status).json({ message: result.message, data: result.data });
});

const verifyOtp = catchAsync(async (req, res) => {
    try {
        const { email, otp, type } = req.body;
        const result = await authService.verifyOtp(email, otp, type);
        res.status(result.status).json({ message: result.message });
    } catch (error) {
        console.error('Error in verifyOtp controller:', error);
        res.status(CONSTANTS.INTERNAL_SERVER_ERROR).json({ message: CONSTANTS.INTERNAL_SERVER_ERROR_MSG });
    }
});

const login = catchAsync(async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);

        if (result.status !== CONSTANTS.SUCCESSFUL) {
            return res.status(result.status).json({ message: result.message });
        }

        // ✅ TRACK LOGIN ACTIVITY HERE
        const userAgent = req.headers['user-agent'];
        const ip = req.ip || req.connection.remoteAddress;

        const { _id: userId } = result.data;

        // Save login activity
        await LoginActivity.create({
            userId,
            ipAddress: ip,
            browser: userAgent,
            loggedInAt: new Date()
        });

        res.json({
            message: CONSTANTS.USER_LOGIN_SUCCESS,
            ...result.data
        });
    } catch (error) {
        console.error('Error in login controller:', error);
        res.status(CONSTANTS.INTERNAL_SERVER_ERROR).json({ message: CONSTANTS.INTERNAL_SERVER_ERROR_MSG });
    }
});

const getLoginActivity = catchAsync(async (req, res) => {
    try {
        const userId = req.user._id;

        const activities = await LoginActivity.find({ userId })
            .sort({ loggedInAt: -1 })
            .limit(10);

        res.status(200).json({ message: "Login activity fetched", data: activities });
    } catch (error) {
        console.error("Error in getLoginActivity controller:", error);
        res.status(500).json({ message: CONSTANTS.INTERNAL_SERVER_ERROR_MSG });
    }
});

// Forgot Password Endpoint
const forgotPassword = catchAsync(async (req, res) => {
    try {
        const { email } = req.body;
        const result = await authService.forgotPassword(email);
        res.status(result.status).json({ message: result.message });
    } catch (error) {
        console.error('Error in forgotPassword controller:', error);
        res.status(CONSTANTS.INTERNAL_SERVER_ERROR).json({ message: CONSTANTS.INTERNAL_SERVER_ERROR_MSG });
    }
});

// Reset Password Endpoint
const resetPassword = catchAsync(async (req, res) => {
    try {
        const { email, newPassword, confirmPassword } = req.body;
        const result = await authService.resetPassword(email, newPassword, confirmPassword);
        res.status(result.status).json({ message: result.message });
    } catch (error) {
        console.error('Error in resetPassword controller:', error);
        res.status(CONSTANTS.INTERNAL_SERVER_ERROR).json({ message: CONSTANTS.INTERNAL_SERVER_ERROR_MSG });
    }
});

// Resend Email Verification OTP Endpoint
const resendEmailOtp = catchAsync(async (req, res) => {
    try {
        const { email } = req.body;
        const result = await authService.resendEmailOtp(email);
        res.status(result.status).json({ message: result.message });
    } catch (error) {
        console.error('Error in resendEmailOtp controller:', error);
        res.status(CONSTANTS.INTERNAL_SERVER_ERROR).json({ message: CONSTANTS.INTERNAL_SERVER_ERROR_MSG });
    }
});

// Resend Password Reset OTP Endpoint
const resendPasswordResetOtp = catchAsync(async (req, res) => {
    try {
        const { email } = req.body;
        const result = await authService.resendPasswordResetOtp(email);
        res.status(result.status).json({ message: result.message });
    } catch (error) {
        console.error('Error in resendPasswordResetOtp controller:', error);
        res.status(CONSTANTS.INTERNAL_SERVER_ERROR).json({ message: CONSTANTS.INTERNAL_SERVER_ERROR_MSG });
    }
});

const changePassword = catchAsync(async (req, res) => {
    try {
        const { email, currentPassword, newPassword, confirmPassword } = req.body;
        const result = await authService.changePassword(email, currentPassword, newPassword, confirmPassword);
        res.status(result.status).json({ message: result.message });
    } catch (error) {
        console.error('Error in changePassword controller:', error);
        res.status(CONSTANTS.INTERNAL_SERVER_ERROR).json({ message: CONSTANTS.INTERNAL_SERVER_ERROR_MSG });
    }
});

module.exports = { register, verifyOtp, login, forgotPassword, resetPassword, resendEmailOtp, resendPasswordResetOtp, changePassword, getLoginActivity };