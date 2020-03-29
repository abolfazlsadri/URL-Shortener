const mongoose = require("../adapters/mongoose");
const Schema = mongoose.Schema;
const Joi = require('joi');

const UrlSchema = new Schema({
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

const Url = mongoose.model('Urls', UrlSchema);

//function to validate user 
function validateUrl(request) {
    const schema = {
      period: Joi.string().required(), // today , yesterday , week , mounth
      type: Joi.string().required() // url , url_os , url_browser , user , user_os , user_browser
    };
  
    return Joi.validate(request, schema);
  }

module.exports = {Url , validateUrl}; 
