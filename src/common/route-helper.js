const { authorize } = require('../auth/google');
const { TOKEN_PATH, SCOPES } = require('./constants');
const fs = require('fs');
const opn = require('open');
const { deleteFile } = require('./utils');

const authCheck = (req, res) => {
  return new Promise((resolve, reject) => {
    authorize(req, async function (authClient) {
      await checkToken(authClient);
      resolve(authClient);
    });
  });
}

const isTokenUnavailable = async () => {
  const tokenUnavailable = await new Promise((resolve) => {
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) {
        resolve(true);
      }
      resolve(false);
    });
  });
  return tokenUnavailable;
}

const checkToken = async (oauth2Client) => {
  const tokenUnavailable = await isTokenUnavailable();
  if (oauth2Client.isTokenExpiring() || tokenUnavailable) {
    await deleteFile(TOKEN_PATH);
    // grab the url that will be used for authorization
    const authorizeUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES.join(' '),
      include_granted_scopes: true
    });
    // open the browser to the authorize url to start the workflow
    opn(authorizeUrl, { wait: false }).then(cp => cp.unref());
  }
}

module.exports = {
  authCheck,
  checkToken,
  isTokenUnavailable
}
