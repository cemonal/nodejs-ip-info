// Import required libraries.
const express = require('express');
const logger = require('./utils/logger');
const config = require('./config');
const port = process.env.PORT || (config.port || 3000);
const ipService = require('./services/ipService');
const rateLimiter = require('./middlewares/rateLimiter');

// Create an Express.js application.
const app = express();

rateLimiter.configure(app);
ipService.configure(app);

const environment = process.env.NODE_ENV || 'development';

// Disable TLS certificate validation in development mode
if (environment === "development")
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Endpoint to retrieve the public IP address of the client.
app.get('/', async (req, res) => {
  const ipAddress = await ipService.getClientIp(req);
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
