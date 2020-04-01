const mongoose = require("../adapters/mongoose");
const Schema = mongoose.Schema;
const Joi = require('joi');

const UrlLogSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  urlSlug: {
      type: String,
      required: true
  },
  ip: {
    type: String
  },
  os: {
    type: String,
    required: true
  },
  browser: {
    type: String,
    required: true
  },

}, {timestamps : true});

const UrlLog = mongoose.model('Urls', UrlLogSchema);

//function to validate user 
function validateUrl(request) {
    const schema = {
      period: Joi.valid(['today', 'yesterday', 'week', 'mounth']).required(),
      type: Joi.valid(['url', 'url_os', 'url_browser', 'user', 'user_os', 'user_browser']).required()
    };
    return Joi.validate(request, schema);
  }

module.exports = {UrlLog , validateUrl}; 
