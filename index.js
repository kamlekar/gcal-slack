require('dotenv').config();
const process = require('process');
const https = require('https');
const fs = require('fs');
const { initRoutes } = require('./src/routes');
const { authorize } = require('./src/auth/google');
const { app } = require('./app');
const { auth } = require('./src/auth');
const { checkToken } = require('./src/common/route-helper');


const PORT = process.env.PORT;

const options = {
  key: fs.readFileSync(__dirname + '/localhost-key.pem'),
  cert: fs.readFileSync(__dirname + '/localhost.pem')
};

https.createServer(options, (req, res) => {
  app(req, res);
}).listen(PORT, () => {
  console.log('Server started!!');
});


initRoutes(app);

module.exports = app;
