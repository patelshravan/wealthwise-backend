const router = require('express').Router();
const { register, login, verifyOtp, forgotPassword, resetPassword, resendEmailOtp,
    resendPasswordResetOtp, changePassword } = require('../../../controllers/auth/auth.controller');

router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/resend-otp', resendEmailOtp);
router.post('/resend-password-reset-otp', resendPasswordResetOtp);
router.post('/change-password', changePassword);

module.exports = router;
