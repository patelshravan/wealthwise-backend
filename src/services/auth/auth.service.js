const User = require('../../models/User');
const CONSTANTS = require('../../config/constant');
const { sendOtpOnMail, sendPasswordResetOtpOnMail } = require('../../utils/sendEmail');
const generateToken = require('../../utils/generateToken');
const bcrypt = require('bcryptjs');

const register = async (name, email, password, confirmPassword) => {
    try {
        // Check if passwords match
        if (password !== confirmPassword) {
            return {
                status: CONSTANTS.BAD_REQUEST,
                message: CONSTANTS.PASSWORD_AND_CONFIRM_PASSWORD_NOT_MATCH,
            };
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return { status: CONSTANTS.BAD_REQUEST, message: CONSTANTS.USER_ALREADY_EXISTS };
        }

        const emailOTP = Math.floor(100000 + Math.random() * 900000).toString();
        const emailOTPExpires = Date.now() + 10 * 60 * 1000;

        await User.create({ name, email, password, emailOTP, emailOTPExpires });
        await sendOtpOnMail(email, name, emailOTP);

        return { status: CONSTANTS.CREATED_CODE, message: CONSTANTS.USER_CREATE };
    } catch (error) {
        console.error('Error in register service:', error);
        return { status: CONSTANTS.INTERNAL_SERVER_ERROR, message: CONSTANTS.INTERNAL_SERVER_ERROR_MSG };
    }
};

// -- VERIFY OTP
const verifyOtp = async (email, otp, type) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return { status: CONSTANTS.BAD_REQUEST, message: CONSTANTS.USER_NOT_FOUND };
        }

        let isValid = false;
        if (type === 'email') {
            isValid = (user.emailOTP === otp && user.emailOTPExpires > Date.now());
        } else if (type === 'reset') {
            isValid = (user.passwordResetOTP === otp && user.passwordResetExpires > Date.now());
        }

        if (!isValid) {
            return { status: CONSTANTS.BAD_REQUEST, message: CONSTANTS.INVALID_OTP_MSG };
        }

        if (type === 'email') {
            user.isVerified = true;
            user.emailOTP = null;
            user.emailOTPExpires = null;
        } else if (type === 'reset') {
            user.passwordResetOTP = null;
            user.passwordResetExpires = null;
        }

        await user.save();
        return { status: CONSTANTS.SUCCESSFUL, message: CONSTANTS.OTP_VERIFIED };
    } catch (error) {
        console.error('Error in verifyOtp service:', error);
        return { status: CONSTANTS.INTERNAL_SERVER_ERROR, message: CONSTANTS.INTERNAL_SERVER_ERROR_MSG };
    }
};

// -- LOGIN
const login = async (email, password) => {
    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return { status: CONSTANTS.UNAUTHORIZED, message: CONSTANTS.UNAUTHORIZED_MSG };
        }

        if (!user.isVerified) {
            return { status: CONSTANTS.UNAUTHORIZED, message: CONSTANTS.USER_NOT_VERIFIED };
        }

        const token = generateToken(user._id);

        return {
            status: CONSTANTS.SUCCESSFUL,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                profileImage: user.profileImage || '',
                token,
            },
        };
    } catch (error) {
        console.error('Error in login service:', error);
        return { status: CONSTANTS.INTERNAL_SERVER_ERROR, message: CONSTANTS.INTERNAL_SERVER_ERROR_MSG };
    }
};

// -- FORGOT PASSWORD: Generate OTP for password reset and send email
const forgotPassword = async (email) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return { status: CONSTANTS.BAD_REQUEST, message: CONSTANTS.UNRECOGNISED_EMAIL };
        }

        const passwordResetOTP = Math.floor(100000 + Math.random() * 900000).toString();
        const passwordResetExpires = Date.now() + 10 * 60 * 1000;

        user.passwordResetOTP = passwordResetOTP;
        user.passwordResetExpires = passwordResetExpires;
        await user.save();

        await sendPasswordResetOtpOnMail(email, user.name, passwordResetOTP);

        return { status: CONSTANTS.SUCCESSFUL, message: CONSTANTS.FORGOT_PASSWORD };
    } catch (error) {
        console.error('Error in forgotPassword service:', error);
        return { status: CONSTANTS.INTERNAL_SERVER_ERROR, message: CONSTANTS.INTERNAL_SERVER_ERROR_MSG };
    }
};

// -- RESET PASSWORD: Verify OTP and update password
const resetPassword = async (email, newPassword, confirmPassword) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return { status: CONSTANTS.BAD_REQUEST, message: CONSTANTS.UNRECOGNISED_EMAIL };
        }

        if (newPassword !== confirmPassword) {
            return { status: CONSTANTS.BAD_REQUEST, message: CONSTANTS.NEW_PASSWORD_AND_CONFIRM_PASSWORD_NOT_MATCH };
        }

        user.password = newPassword;
        await user.save();

        return { status: CONSTANTS.SUCCESSFUL, message: CONSTANTS.PASSWORD_UPDATED };
    } catch (error) {
        console.error('Error in resetPassword service:', error);
        return { status: CONSTANTS.INTERNAL_SERVER_ERROR, message: CONSTANTS.INTERNAL_SERVER_ERROR_MSG };
    }
};

// -- RESEND EMAIL VERIFICATION OTP
const resendEmailOtp = async (email) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return { status: CONSTANTS.BAD_REQUEST, message: CONSTANTS.USER_NOT_FOUND };
        }

        if (user.isVerified) {
            return { status: CONSTANTS.BAD_REQUEST, message: CONSTANTS.USER_ALREADY_VERIFIED };
        }

        const emailOTP = Math.floor(100000 + Math.random() * 900000).toString();
        const emailOTPExpires = Date.now() + 10 * 60 * 1000;

        user.emailOTP = emailOTP;
        user.emailOTPExpires = emailOTPExpires;
        await user.save();

        await sendOtpOnMail(email, user.name, emailOTP);

        return { status: CONSTANTS.SUCCESSFUL, message: CONSTANTS.OTP_RESEND };
    } catch (error) {
        console.error('Error in resendEmailOtp service:', error);
        return { status: CONSTANTS.INTERNAL_SERVER_ERROR, message: CONSTANTS.INTERNAL_SERVER_ERROR_MSG };
    }
};

// -- RESEND PASSWORD RESET OTP
const resendPasswordResetOtp = async (email) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return { status: CONSTANTS.BAD_REQUEST, message: CONSTANTS.UNRECOGNISED_EMAIL };
        }

        const passwordResetOTP = Math.floor(100000 + Math.random() * 900000).toString();
        const passwordResetExpires = Date.now() + 10 * 60 * 1000;

        user.passwordResetOTP = passwordResetOTP;
        user.passwordResetExpires = passwordResetExpires;
        await user.save();

        await sendPasswordResetOtpOnMail(email, user.name, passwordResetOTP);

        return { status: CONSTANTS.SUCCESSFUL, message: CONSTANTS.PASSWORD_RESET_OTP_RESEND };
    } catch (error) {
        console.error('Error in resendPasswordResetOtp service:', error);
        return { status: CONSTANTS.INTERNAL_SERVER_ERROR, message: CONSTANTS.INTERNAL_SERVER_ERROR_MSG };
    }
};

const changePassword = async (email, currentPassword, newPassword, confirmPassword) => {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return { status: 404, message: "User not found" };
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        return { status: 400, message: "Current password is incorrect" };
    }

    if (newPassword !== confirmPassword) {
        return { status: 400, message: "Passwords do not match" };
    }

    user.password = newPassword;
    await user.save();

    return { status: 200, message: "Password changed successfully" };
};

module.exports = { register, verifyOtp, login, forgotPassword, resetPassword, resendEmailOtp, resendPasswordResetOtp, changePassword };