// rateLimiter.js
const rateLimit = require('express-rate-limit');
const config = require('../config');

function configure(app) {
  // Load rate limit configuration from the config file
  const rateLimitConfig = config.rateLimit;

  if (rateLimitConfig) {
    // Apply rate limiting middleware if configured
    const limiter = rateLimit({
      windowMs: rateLimitConfig.windowMs || 15 * 60 * 1000,
      max: rateLimitConfig.max || 100
    });

    app.use(limiter);
  }
}

module.exports = {
  configure,
};