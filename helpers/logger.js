const NODE_ENV = process.env.NODE_ENV || 'development';
const path = require('path');
const { createLogger, format, transports } = require('winston');

const { 
  logLevel,
  errLogFile, 
  yektanetLogFile
} = require('../config/logger');

const appConfig = require('../config/app');

const errLogFileAddr = path.join(process.env.ROOT_ADDR, errLogFile);
const yektanetLogFiles = path.join(process.env.ROOT_ADDR, yektanetLogFile);

const logger = createLogger({
  level: logLevel,
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
  defaultMeta: { service: appConfig.name },
  transports: [
    new transports.File({ filename: errLogFileAddr, level: 'error' }),
    new transports.File({ filename: yektanetLogFiles })
  ],
});

//
// If we're not in production then **ALSO** log to the `console`
// with the colorized simple format.
//
if (NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple(),
    ),
  }));
}
logger.createLogRecord = ({
  logType,
  reference,
  logStatus,
  logMessage,
  shouldBeLogged = false,
}) => {
  try {
      if (shouldBeLogged) {
        if (!logMessage) {
          if (logStatus == 'success') logger.info(`recorded new log for type/reference: ${logType}/${reference}.`);
          if (logStatus == 'fail') logger.error(`recorded new log for type/reference: ${logType}/${reference}.`);
        } else {
          if (logStatus == 'success') logger.info(logMessage);
          if (logStatus == 'fail') logger.error(logMessage);
        }
      }
    }catch(err ) {
      logger.info(`could not save log record for type/reference: ${logType}/${reference}.`);
      logger.error(err);
    };
    return;
}
module.exports = logger;
