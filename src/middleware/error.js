const mongoose = require('mongoose');
const httpStatus = require('http-status');
const config = require('../config/config');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');

const errorConverter = (err, req, res, next) => {
    let error = err;

    if (!(error instanceof ApiError)) {
        let statusCode;
        if (error.statusCode && Number.isInteger(error.statusCode)) {
            statusCode = error.statusCode;
        } else if (error instanceof mongoose.Error) {
            statusCode = httpStatus.BAD_REQUEST || 400; // Fallback to 400 if httpStatus.BAD_REQUEST is invalid
        } else {
            statusCode = httpStatus.INTERNAL_SERVER_ERROR || 500; // Fallback to 500 if httpStatus.INTERNAL_SERVER_ERROR is invalid
        }

        const message = error.message || httpStatus[statusCode] || 'An unexpected error occurred';
        console.log('Creating ApiError in errorConverter:', { statusCode, message, isMongooseError: error instanceof mongoose.Error });
        error = new ApiError(statusCode, message, false, err.stack);
    }

    next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err;

    if (!Number.isInteger(statusCode)) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR || 500;
        message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR] || 'Internal Server Error';
    }

    if (config.env === 'production' && !err.isOperational) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR || 500;
        message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR] || 'Internal Server Error';
    }

    res.locals.errorMessage = err.message;

    const response = {
        statusCode,
        message,
        ...(config.env === 'development' && { stack: err.stack }),
    };

    if (config.env === 'development') {
        logger.error(err);
    }

    res.status(statusCode).send(response);
};

module.exports = { errorConverter, errorHandler };