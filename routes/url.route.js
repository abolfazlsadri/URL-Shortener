
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const urlController = require('../controller/urlController');
const urlAnalyticsController = require('../controller/urlAnalyticsController')

//body post =>
//"url" : "https://www.sitepoint.com/using-redis-node-js/",
//"pathUser" : "test"
router.post("/shortUrl", auth, urlController.createShortUrl); 

//query string => period=today 
//or yesterday 
//or week 
//or mounth &
// type=url 
//or url_os 
//or url_browser 
//or user 
//or user_os 
//or user_browser
router.get("/getdetail", auth, urlAnalyticsController.getDetail); 

module.exports = router;
