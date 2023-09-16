const { createLogger, format, transports } = require('winston');

// Setup Winston Logger to handle both info and error logs
const logger = createLogger({
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new transports.File({ filename: `./logs/info-${new Date().toISOString().split('T')[0]}.log`, level: 'info' }),
    new transports.File({ filename: `./logs/error-${new Date().toISOString().split('T')[0]}.log`, level: 'error' })
  ]
});

module.exports = logger;