const urlController = {};
const client = require("redis").createClient();
const { LOG_TYPES } = require('../models/LogConstants');
const logger = require('../helpers/logger');
const { maxLength } = require('../config/app');
const useragent = require('useragent');
const { set: urlLogJobs } = require('../jobs/urlLog.jobs');
const { User } = require('../models/user.model');

urlController.createShortUrl = async (req, res) => {
    try {
        let data = req.body;
        data.userId = req.user.id;
        if ( typeof data.pathUser === "undefined"){
            data.pathUser= ""
        }
        let path = req.body.pathUser;
        let id = await generate(path);

        let filter = { '_id': req.user.id };
        User.findOne(filter, function(err, doc){
            doc.urls.push({
                "url" : req.body.url,
                "shortUrl" : req.protocol + "://" + req.get('host') + '/' + id
            });
            doc.save();
        });        
        
        data.id = id;
        await create(data);

        return res.status(200).json({
            'shortUrl': req.protocol + "://" + req.get('host') + '/' + id,
            'url': data.url
        })

    } catch(err) {
                    
        const logData = {
            logType: LOG_TYPES.YEKTANET,
            reference: `create short url failed!`,
            logStatus: 'fail',
            logMessage: err.toString(),
            shouldBeLogged: true,
        };
        logger.createLogRecord(logData);
        
        return res.status(500).json({
            status: false,
            message: err
        });
    }
};

urlController.findRedirect = async function(req, res) {
    try {
        let id = req.params.slug;
        let agent = useragent.parse(req.headers['user-agent']);
        let ip = req.client.remoteAddress
        let os = agent.os.family;
        let browser = agent.family;

        client.hgetall(id, function(err, result) {
            if (err) {
                res.status(500).json({'message': err});
            } else {
                if (result === null) {
                    // url has not been created
                    res.status(404).json({'message': 'id ' + id + ' not found'});
                } else {
                    let data = {
                        "userId": result.userId,
                        "urlSlug": id,
                        "ip": ip,
                        "os": os,
                        "browser": browser
                    } ;
                    urlLogJobs(data);

                    res.redirect(result.url);
                }
            }
        });
    } catch(err) {
                        
        const logData = {
            logType: LOG_TYPES.YEKTANET,
            reference: `create short url failed!`,
            logStatus: 'fail',
            logMessage: err.toString(),
            shouldBeLogged: true,
        };
        logger.createLogRecord(logData);
        
        return res.status(500).json({
            status: false,
            message: err
        });
    }
};

const generate = async (path = '') => {
    let _sym = 'abcdefghijklmnopqrstuvwxyz1234567890';
    let str = path;
    
    for(let i = 0; i < maxLength; i++) {
        str += _sym[parseInt(Math.random() * (_sym.length))];
    }

    let check = await checkId(str);

    if ( check !== 1){
        return str
    }else{
        generate(path)
    }
};

const checkId = (id) => {
    client.exists(id, function(err, reply) {
        return reply;
    });
}

const create = async (data) => {
    await client.hmset(data.id, {
        'url': data.url,
        'created': new Date().getTime(),
        'userId': data.userId
    });
    await client.lpush(data.userId, data.id);
    return true;
}

module.exports = urlController;