// Import required libraries.
const express = require('express');
const logger = require('./utils/logger');
const config = require('./config');
const port = process.env.PORT || (config.port || 3000);
const { requestIp, getClientIp } = require('./services/ipService');
const rateLimiter = require('./middlewares/rateLimiter');
const timingMiddleware = require('./middlewares/timingMiddleware');

// Create an Express.js application.
const app = express();

app.use(requestIp.mw());
rateLimiter.configure(app);
app.use(timingMiddleware);

const environment = process.env.NODE_ENV || 'development';

// Disable TLS certificate validation in development mode
if (environment === "development")
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Endpoint to retrieve the public IP address of the client.
app.get('/', async (req, res) => {
  const ipAddress = await getClientIp(req);
  res.send(ipAddress);
});

// Global error handler for logging and feedback
app.use((err, req, res, next) => {
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method}`);
  res.status(500).send('An error occurred while processing your request. Please try again later.');
});

// Start the server
app.listen(port, () => {
  logger.info(`Server is running in ${environment} mode and listening on port ${port}`);
  console.log(`Server is running in ${environment} mode and listening on port ${port}`);
});
