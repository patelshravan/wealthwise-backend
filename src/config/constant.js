module.exports = {
    SUCCESSFUL: 200,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    TOO_MANY_REQUESTS: 429,
    BAD_GATEWAY: 502,
    GATEWAY_TIMEOUT: 504,
    METHOD_NOT_ALLOWED: 405,
    NOT_ACCEPTABLE: 406,
    UNAUTHORIZED: 401,
    LIMIT_EXCEEDED: 201,
    CREATED_CODE: 201,
    CONFLICT: 409,

    // COMMON
    INTERNAL_SERVER_ERROR_MSG: 'An internal server error has occurred',

    // USER
    PASSWORD_AND_CONFIRM_PASSWORD_NOT_MATCH: 'Password and confirm password do not match',
    USER_ALREADY_EXISTS: 'User already exists',
    UNAUTHORIZED_MSG: 'Please use correct email and password combination.',
    USER_NOT_FOUND: 'User not found',
    USER_NOT_VERIFIED: 'User email has not been verified. Please verify your OTP.',
    USER_CREATE: `Registration successful! We have sent a one time password to your email. Please check your inbox and spam folder. If you haven't received the email, please click the 'Resend' button below.`,
    UNRECOGNISED_EMAIL: 'This email is not registered with us kindly check your email and try again.',
    USER_LOGIN_SUCCESS: 'Login Successfully!',
    USER_FETCH: 'Users fetch Successfully!',
    USER_UPDATED: 'User updated Successfully!',
    USER_DELETE: 'User delete Successfully!',
    FORGOT_PASSWORD: "We have sent a one time password to your email. Please check your inbox and spam folder. If you haven't received the email.",
    NEW_PASSWORD_AND_CONFIRM_PASSWORD_NOT_MATCH: 'New password and confirm password do not match',
    PASSWORD_UPDATED: 'Password updated successfully!',
    USER_ALREADY_VERIFIED: 'User is already verified.',

    INVALID_OTP_MSG: 'Invalid or expired OTP.',
    OTP_VERIFIED: 'OTP verified successfully.',
    OTP_RESEND: 'OTP resent to email for verification.',
    PASSWORD_RESET_OTP_RESEND: 'Password reset OTP resent to email.',

    // EXPENSES
    EXPENSE_CREATE: 'Expense created successfully!',
    EXPENSE_FETCH: 'Expenses fetched successfully!',
    EXPENSE_UPDATE: 'Expense updated successfully!',
    EXPENSE_DELETE: 'Expense deleted successfully!',
    EXPENSE_NOT_FOUND: 'Expense not found',

    // INVESTMENT
    INVESTMENT_CREATE: 'Investment created successfully',
    INVESTMENT_FETCH: 'Investments fetched successfully',
    INVESTMENT_UPDATED: 'Investment updated successfully',
    INVESTMENT_DELETE: 'Investment deleted successfully',
    INVESTMENT_NOT_FOUND: 'Investment not found',

    // LIC (Life Insurance Policy) messages
    LIC_CREATE: 'Policy created successfully',
    LIC_FETCH: 'Policies fetched successfully',
    LIC_UPDATED: 'Policy updated successfully',
    LIC_DELETE: 'Policy deleted successfully',
    LIC_NOT_FOUND: 'Policy not found',
}