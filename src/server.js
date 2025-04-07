const mongoose = require('mongoose');
const config = require('./config/config');
const logger = require('./config/logger');
const app = require('./app');

let server;

// Connect to MongoDB
mongoose.connect(config.mongoose.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    logger.info('Connected to MongoDB');

    // Start Express server
    server = app.listen(config.port, () => {
        logger.info(`Server listening on port ${config.port}`);
    });
}).catch((error) => {
    logger.error('Error connecting to MongoDB:', error.message);
});

// Graceful shutdown handlers
const exitHandler = (error) => {
    if (error) {
        logger.error("Unhandled error:", error);
    }
    if (server) {
        server.close(() => {
            logger.info("Server closed");
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};

process.on("uncaughtException", exitHandler);
process.on("unhandledRejection", exitHandler);
process.on("SIGTERM", () => {
    logger.info("SIGTERM received");
    if (server) {
        server.close();
    }
});
