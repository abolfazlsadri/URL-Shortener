process.env['ROOT_ADDR'] = __dirname;
const express = require('express');
const appConfig = require('./config/app');
const loggerConfig = require('./config/logger');
const app = express();
const bodyParser = require('body-parser');
const requestLogger = require('morgan');
const fs = require('fs');
const path = require('path');
const usersRoute = require("./routes/user.route");
const url = require("./routes/url.route");
const urlController = require('./controller/urlController')
const kue = require('kue');
const kueUiExpress = require('kue-ui-express');

// use config module to get the privatekey, if no private key set, end the application
if (!appConfig.privateToken) {
  console.error("FATAL ERROR: myprivatekey is not defined.");
  process.exit(1);
}

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json());

const accessLogStream = fs.createWriteStream(path.join(__dirname, loggerConfig.yektanetLogFile), { flags: 'a' })
app.use(requestLogger('dev', { stream: accessLogStream }));

kueUiExpress(app, '/kue/', '/kue-api');
app.use('/kue-api/', kue.app);

app.use("/api/user", usersRoute);
app.use("/api/url", url);
app.get("/:slug", urlController.findRedirect);

app.listen(appConfig.port, () => {
  console.log(`${appConfig.name} listening on port: ${appConfig.port}`);
});
