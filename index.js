const path = require('path');
require('dotenv').config();
const process = require('process');
const https = require('https');
const fs = require('fs');
const { initRoutes } = require('./src/routes');
const opn = require('open');
const { SCOPES } = require('./src/common/constants');
const { authorize } = require('./src/auth/google');
const { app } = require('./app');


const PORT = process.env.PORT;

const options = {
  key: fs.readFileSync(__dirname + '/localhost-key.pem'),
  cert: fs.readFileSync(__dirname + '/localhost.pem')
};

https.createServer(options, app).listen(PORT, (req, res) => {
  authorize(req, (oauth2Client) => {
    // grab the url that will be used for authorization
    const authorizeUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES.join(' '),
      include_granted_scopes: true
    });

    // open the browser to the authorize url to start the workflow
    opn(authorizeUrl, { wait: false }).then(cp => cp.unref());
  })
});


initRoutes(app);

module.exports = app;
