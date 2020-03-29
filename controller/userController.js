const userController = {};
const { LOG_TYPES } = require('../models/LogConstants');
const { User, validateUser } = require("../models/user.model");
const logger = require('../helpers/logger');

userController.login = async (req,res,next) =>{
    
    try {
        const { email, password } = req.body
        const user = await User.findByCredentials(email, password)
        if (!user) {
            return res.status(401).json({error: 'Login failed! Check authentication credentials'})
        }

        const token = await user.generateAuthToken()

        const logData = {
            logType: LOG_TYPES.YEKTANET,
            reference: `Login success user => ${user.email} `,
            logStatus: 'success',
            logMessage: 'Login success',
            shouldBeLogged: true,
        };

        logger.createLogRecord(logData);
        
        return res.status(200).json({ "message" : "success", "token" : token })        

    } catch(err) {
                
        const logData = {
            logType: LOG_TYPES.YEKTANET,
            reference: `Login failed!`,
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

userController.register = async (req,res,next) =>{
    try {
        // validate the request body first
        const { error } = validateUser(req.body);
        if (error) return res.status(400).json(error.details[0].message);
        
        // Create a new user
        const users = new User(req.body)
        await users.save();
        
        const token = await users.generateAuthToken()

        const logData = {
            logType: LOG_TYPES.YEKTANET,
            reference: `register new user success user => ${users.email}`,
            logStatus: 'success',
            logMessage: 'register new user success',
            shouldBeLogged: true,
        };

        logger.createLogRecord(logData);
        
        return res.status(200).json({ "message" : "success", "token" : token })

    } catch(err) {
                
        const logData = {
            logType: LOG_TYPES.YEKTANET,
            reference: `register new user fail user`,
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

userController.logout = async (req, res) => {
    try {
        // validate the request body first
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })

        await req.user.save()

        const logData = {
            logType: LOG_TYPES.YEKTANET,
            reference: `logout user success user => ${req.user.email}`,
            logStatus: 'success',
            logMessage: 'logout user success',
            shouldBeLogged: true,
        };

        logger.createLogRecord(logData);
        
        return res.status(200).json({ "message" : "success" })

    
    } catch(err) {
                
        const logData = {
            logType: LOG_TYPES.YEKTANET,
            reference: `logout user fail user`,
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
module.exports = userController;