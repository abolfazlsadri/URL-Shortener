module.exports = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || '6379',
    auth: process.env.REDIS_PASS || '',
    db  : process.env.REDIS_DB || 2
  };
