const urlLogController = {};
const { LOG_TYPES } = require('../models/LogConstants');
const logger = require('../helpers/logger');
const urlService = require('../services/url.service');
const { validateUrl } = require('../models/urlLog.model');

urlLogController.getDetail = async (req,res,next) =>{
    try {
        // validate the request body first
        const { error } = validateUrl(req.query);
        if (error) return res.status(400).json(error.details[0].message);

        const data = {
          userId: req.user.id,
          period: req.query.period,
          type: req.query.type
        }
        const result = await urlService.getReports(data);

        const logData = {
            logType: LOG_TYPES.YEKTANET,
            reference: `get report success `,
            logStatus: 'success',
            logMessage: 'report success',
            shouldBeLogged: true,
        };

        logger.createLogRecord(logData);
        
        return res.status(200).json({ "result" : result })        

    } catch(err) {
                
        const logData = {
            logType: LOG_TYPES.YEKTANET,
            reference: `get report failed!`,
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
}

module.exports = urlLogController;