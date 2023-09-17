const { createLogger, format, transports } = require('winston');

// Define a custom format to display logs in the console
const consoleFormat = format.printf(({ timestamp, level, message }) => {
  return `${timestamp} ${level}: ${message}`;
});

// Setup Winston Logger to handle both info and error logs
const logger = createLogger({
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new transports.File({ filename: `./logs/info-${new Date().toISOString().split('T')[0]}.log`, level: 'info' }),
    new transports.File({ filename: `./logs/error-${new Date().toISOString().split('T')[0]}.log`, level: 'error' }),
    new transports.Console({ format: format.combine(format.colorize(), consoleFormat) })
  ]
});

module.exports = logger;