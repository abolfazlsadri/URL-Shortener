process.env['ROOT_ADDR'] = __dirname;
const kue = require('kue');
const redisConf = require('./config/redis');
const analyticsJobs = require('./jobs/analytics.jobs');

const queue = kue.createQueue({redis: redisConf});

queue.process('analyticsJobs', (job, done) => {
    analyticsJobs.handle(job.data, done);
});

