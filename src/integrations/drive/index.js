const { authCheck } = require('../../common/route-helper');
const { uploadFile } = require('./upload');

const driveRoutes = (app) => {
  app.post('/drive/upload', (req, res) => {
    authCheck(req, res).then((authClient) => uploadFile(req, res, authClient).then((file) => {
      res.end(JSON.stringify(file.data));
    }))
  });
}

module.exports = {
  driveRoutes
}