module.exports = {
    logLevel: process.env.LOG_LEVEL || 'info',
    errLogFile: process.env.LOG_ERR_FILE || 'logs/urlShortener-error.log',
    yektanetLogFile: process.env.LOG_YEKTANET_FILE || 'logs/urlShortener.log',
  };
    