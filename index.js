const path = require('path');
require('dotenv').config();
const process = require('process');
const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');
const { initRoutes } = require('./src/routes');
const { oauth2Client } = require('./src/auth/google');
const opn = require('open');
const { SCOPES } = require('./src/common/constants');

// Create express app.
const app = express();

const PORT = process.env.PORT;

const options = {
  key: fs.readFileSync('localhost-key.pem'),
  cert: fs.readFileSync('localhost.pem')
};

https.createServer(options, app).listen(PORT, () => {
  // grab the url that will be used for authorization
  const authorizeUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES.join(' '),
  });

  // open the browser to the authorize url to start the workflow
  opn(authorizeUrl, { wait: false }).then(cp => cp.unref());
});

// Use body parser which we will use to parse request body that sending from client.
app.use(bodyParser.json());

// We will store our client files in ./client directory.
app.use(express.static(path.join(__dirname, 'client')));

initRoutes(app);
