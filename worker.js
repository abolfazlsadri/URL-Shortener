process.env['ROOT_ADDR'] = __dirname;
const kue = require('kue');
const redisConf = require('./config/redis');
const urlLogJobs = require('./jobs/urlLog.jobs');

const queue = kue.createQueue({redis: redisConf});

queue.process('urlLogJobs', (job, done) => {
    urlLogJobs.handle(job.data, done);
});

