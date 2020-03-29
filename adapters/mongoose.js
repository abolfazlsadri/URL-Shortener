const mongoose = require('mongoose');
const mongo = require('../config/mongo');

mongoose.connect(mongo.uri, { useNewUrlParser: true });

module.exports = mongoose;