const { auth } = require('../../auth');
const { uploadFile } = require('./upload');

const driveRoutes = (app) => {
  app.post('/drive/upload', (req, res) => {
    const authClient = auth.getClient();
    uploadFile(req, res, authClient).then((files) => {
      res.end(JSON.stringify(files));
    })
  });
}

module.exports = {
  driveRoutes
}
