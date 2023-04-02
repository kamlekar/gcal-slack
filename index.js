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
const { isTokenUnavailable } = require('./src/common/route-helper');
const { auth } = require('./src/auth');


const PORT = process.env.PORT;

const options = {
  key: fs.readFileSync(__dirname + '/localhost-key.pem'),
  cert: fs.readFileSync(__dirname + '/localhost.pem')
};

https.createServer(options, (req, res) => {
  if (req.url === '/clearToken') {
    app(req, res);
    return;
  }

  authorize(req, async (oauth2Client) => {
    auth.setClient(oauth2Client);
    const tokenUnavailable = await isTokenUnavailable();
    if (oauth2Client.isTokenExpiring() || tokenUnavailable) {
      // grab the url that will be used for authorization
      const authorizeUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES.join(' '),
        include_granted_scopes: true
      });
      // open the browser to the authorize url to start the workflow
      opn(authorizeUrl, { wait: false }).then(cp => cp.unref());
    }

    app(req, res);
  })
}).listen(PORT, () => {
  console.log('Server started!!');
});


initRoutes(app);

module.exports = app;
