const logger = require('../utils/logger');
const { getClientIp } = require('../services/ipService');

/**
 * Express middleware to measure the time it takes for each HTTP request to complete.
 * It logs the request details and the elapsed time in milliseconds.
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - The next middleware function in the chain
 */
async function timingMiddleware(req, res, next) {
    const startTime = Date.now();
    const clientIp = await getClientIp(req);

    // Log request details
    logger.info(`${req.method} ${req.url} from ${clientIp}`);

    res.on('finish', () => {
        const endTime = Date.now();
        const elapsedTime = endTime - startTime;

        // Log elapsed time and status code
        logger.info(`${req.method} ${req.url} - Status: ${res.statusCode} - Elapsed Time: ${elapsedTime} ms - ${clientIp}`);
    });

    next();
}

module.exports = timingMiddleware;