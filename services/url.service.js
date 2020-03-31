const logger = require('../helpers/logger');
const { LOG_TYPES } = require('../models/LogConstants');
const { UrlLog } = require('../models/urlLog.model');
const urlService = {};

urlService.create = async (data) => {
    let logData;
    try {
        const urlLogModel = new UrlLog({
            userId: data.userId,
            urlSlug: data.urlSlug,
            ip: data.ip,
            os: data.os,
            browser: data.browser  
        });
        await urlLogModel.save();

        logData = {
            logType: LOG_TYPES.YEKTANET,
            logStatus: 'success',
            payload: JSON.stringify(data),
            logMessage: 'Insert to database urls success',
            shouldBeLogged: true,
        };
        logger.createLogRecord(logData);
        return true;

    }catch(err){
        logData = {
            logType: LOG_TYPES.YEKTANET,
            logStatus: 'fail',
            payload: JSON.stringify(data),
            logMessage: 'Insert to database urls fail',
            shouldBeLogged: false,
        };
        logger.createLogRecord(logData);
        return false;
    }
}


const generateDate = async (peroid) => {
    let logData;
    try {
        let start ='';
        let end = '';
        switch (peroid) {
            case 'today':
                start = new Date();
                end = new Date();
                start.setHours(0,0,0,0);
                end.setHours(23,59,59,999);
                break;
            case 'yesterday':
                start = new Date();
                end = new Date();
                start.setDate(start.getDate() - 1);
                end.setDate(end.getDate() - 1);
                start.setHours(0,0,0,0);
                end.setHours(23,59,59,999);
                break;
            case 'week':
                start = new Date();
                end = new Date();
                start.setDate(start.getDate() - 8);
                end.setDate(end.getDate() - 1);
                start.setHours(0,0,0,0);
                end.setHours(23,59,59,999);
                break;
            case 'mounth':
                start = new Date();
                end = new Date();
                start.setDate(start.getDate() - 31);
                end.setDate(end.getDate() - 1);
                start.setHours(0,0,0,0);
                end.setHours(23,59,59,999);
                break;
            default:
              return done(new Error(`404: request action didn't match!`));
        }
        logData = {
            logType: LOG_TYPES.YEKTANET,
            logStatus: 'success',
            payload: JSON.stringify(peroid),
            logMessage: 'generate proid time success',
            shouldBeLogged: true,
        };
        logger.createLogRecord(logData);
        return { "start": start, "end": end};

    }catch(err){
        logData = {
            logType: LOG_TYPES.YEKTANET,
            logStatus: 'fail',
            payload: JSON.stringify(peroid),
            logMessage: 'generate proid time fail',
            shouldBeLogged: false,
        };
        logger.createLogRecord(logData);
        return false;
    }
}
const getUrlRequestCount = async (data) => {
    let result = await UrlLog.aggregate([ 
        { $match : { userId : data.userId, createdAt: { $gte: data.start, $lt: data.end }} },
        {$group:{_id:{slug:'$urlSlug' }, count:{$sum:1}}}, 
        {$group:{_id:'$_id.slug', count:{$first:'$count'}}}
    ]);
   
    return result;
}

const getUrlRequestCountOS = async (data) => {
    let result = await UrlLog.aggregate([
        { $match : { userId : data.userId, createdAt: { $gte: data.start, $lt: data.end }} },
        {
          $group:{
             _id:{slug:"$urlSlug", os:"$os"},
             count:{$sum:1}
          }
        },
        {
          $group:{
             _id:"$_id.slug",
             data:{$push:{os:"$_id.os", count:"$count", slug: "$_id.slug"}}
          }
        },
        { $project: { _id: 0 } }
    ])


    return result;
}

const getUrlRequestCountBrowser = async (data) => {
    let result = await UrlLog.aggregate([
        { $match : { userId : data.userId, createdAt: { $gte: data.start, $lt: data.end }} },
        {
          $group:{
             _id:{slug:"$urlSlug", browser:"$browser"},
             count:{$sum:1}
          }
        },
        {
          $group:{
             _id:"$_id.slug",
             data:{$push:{browser:"$_id.browser", count:"$count", slug: "$_id.slug"}}
          }
        },
        { $project: { _id: 0 } }
    ])

    return result;
}

const getUrlRequestIpCount = async (data) => {
    let result = await UrlLog.aggregate([
        { $match : { userId : data.userId, createdAt: { $gte: data.start, $lt: data.end }} },
        {
          $group:{
             _id:{ip:"$ip", slug:"$urlSlug"},
             count:{$sum:1}
          }
        },
        {
          $group:{
             _id:"$_id.ip",
             data:{$push:{ip:"$_id.ip", count:"$count", "slug": "$_id.slug"}}
          }
        },
        { $project: { _id: 0 } }
    ])

    return result;
}

const getUrlRequestIpCountOS = async (data) => {
    let result = await UrlLog.aggregate([
        { $match : { userId : data.userId, createdAt: { $gte: data.start, $lt: data.end }} },
        {
          $group:{
             _id:{ip:"$ip", os:"$os", slug:"$urlSlug"},
             count:{$sum:1}
          }
        },
        {
          $group:{
             _id:"$_id.ip",
             data:{$push:{os:"$_id.os", count:"$count", ip: "$_id.ip", slug: "$_id.slug"}}
          }
        },
        { $project: { _id: 0 } }
    ])

    return result;
}

const getUrlRequestIpCountBrowser = async (data) => {
    let result = await UrlLog.aggregate([
        { $match : { userId : data.userId, createdAt: { $gte: data.start, $lt: data.end }} },
        {
          $group:{
             _id:{ip:"$ip", browser:"$browser",slug:"$urlSlug"},
             count:{$sum:1}
          }
        },
        {
          $group:{
             _id:"$_id.ip",
             data:{$push:{browser:"$_id.browser", count:"$count", ip: "$_id.ip", slug: "$_id.slug"}}
          }
        },
        { $project: { _id: 0 } }
    ])

    return result;
}

urlService.getReports = async (data) => {
    let logData;
    try {
        let response;
        let generate = await generateDate(data.period);
        data.start = generate.start;
        data.end = generate.end;

        switch (data.type) {
            case 'url':
                response = await getUrlRequestCount(data);
                break;
            case 'url_os':
                response = await getUrlRequestCountOS(data);
                break;
            case 'url_browser':
                response = await getUrlRequestCountBrowser(data);
                break;
            case 'user':
                response = await getUrlRequestIpCount(data);
                break;
            case 'user_os':
                response = await getUrlRequestIpCountOS(data);
                break;
            case 'user_browser':
                response = await getUrlRequestIpCountBrowser(data);
                break;
            default:
              return done(new Error(`404: request action didn't match!`));
        }
        logData = {
            logType: LOG_TYPES.YEKTANET,
            logStatus: 'success',
            payload: JSON.stringify(data),
            logMessage: 'get report success',
            shouldBeLogged: true,
        };
        logger.createLogRecord(logData);
        return response;

    }catch(err){
        logData = {
            logType: LOG_TYPES.YEKTANET,
            logStatus: 'fail',
            payload: JSON.stringify(data),
            logMessage: 'get report fail',
            shouldBeLogged: false,
        };
        logger.createLogRecord(logData);
        return false;
    }
}

module.exports = urlService;
