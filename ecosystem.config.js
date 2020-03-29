const NODE_PATH = '.'

module.exports = {
  apps : [{
    name        : "yektanet",
    script      : "./app.js",
    watch       : false,
    error_file  : "./logs/pm2-dms-err.log",
    ignore_watch: "./*.log",
    out_file    : "./logs/pm2-dms-out.log",
    merge_logs  : true,
    env: {
      "NODE_ENV": "development",
      NODE_PATH
    },
    env_production : {
       "NODE_ENV": "production"
    }
  },{
    name       : "yektanet-worker",
    script     : "./worker.js",
    error_file : "./logs/pm2-dms-worker-err.log",
    out_file   : "./logs/pm2-dms-worker-out.log",
    ignore_watch: "./*.log",
    merge_logs : true,
    env: {
      "NODE_ENV": "development",
      NODE_PATH
    },
    env_production : {
       "NODE_ENV": "production"
    }
  }]
}