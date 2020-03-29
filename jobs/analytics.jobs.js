const kue   = require('kue');
const redisConf = require('../config/redis');
const logger = require('../helpers/logger');
const { LOG_TYPES } = require('../models/LogConstants');
const urlService = require('../services/url.service')

const queue       = kue.createQueue({redis: redisConf});
const DELAY       = 1 * 1000, // 1 second
      JOB_TTL     = 5 * 60 * 1000, // 5min before expiry
      RETRY_DELAY = 0.1 * 60 * 1000, // 1 mins
      ATTEMPTS    = 3;

const set = function (data) {
  let job = queue.create('analyticsJobs', {
    title: `URL detail request`,
    data,
  })
  .delay(DELAY)
  .ttl(JOB_TTL)
  .attempts(ATTEMPTS)
  .backoff({delay: RETRY_DELAY, type: 'fixed'})
  .removeOnComplete(true)
  .save();

  job.on('complete', function(result){
    logger.info('analytics job completed.');
  }).on('failed attempt', function(errorMessage, doneAttempts){
    logger.error('analytics Job failed');
    logger.error(errorMessage);
  }).on('failed', async function(errorMessage){
    logger.error('analytics Job failed Compeletely');
    logger.error(errorMessage);
  })
};

const handle = async function (jobData, done) {
  logger.info(`job:: ${jobData.title}`);
  try { 
   let response = await urlService.create(jobData.data);

    const logData = {
      logType: LOG_TYPES.YEKTANET,
      reference: `analytics call`,
      logStatus: 'success',
      payload: JSON.stringify({ status: response }),
      logMessage: `new analytics submitted!`,
      shouldBeLogged: true,
    };

    if (!response) {
      logData.logStatus = 'fail';
      logData.logMessage = `Could not submit analytics`;
      logger.createLogRecord(logData)
      logger.error(response.payload);
      return done(new Error(`analytics submit failed.`));
    }

    logger.createLogRecord(logData);
    return done();
  } catch(err) {
    logger.error(err);
    return done(new Error(err));
  }
};

module.exports = { set, handle };
