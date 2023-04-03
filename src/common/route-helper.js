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
  console.log('isTokenUnavailable: IN');
  const tokenUnavailable = await new Promise((resolve) => {
    console.log('isTokenUnavailable: about to call fs.readFile');
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) {
        console.log('isTokenUnavailable: error while reading file');
        resolve(true);
      }
      else {
        console.log('isTokenUnavailable: success while reading file');
        resolve(false);
      }
    });
  });
  console.log('tokenUnavailable', tokenUnavailable);
  return tokenUnavailable;
}

const checkToken = async (oauth2Client) => {
  console.log('checkToken: IN', oauth2Client);
  const tokenUnavailable = await isTokenUnavailable();
  if (oauth2Client.isTokenExpiring() || tokenUnavailable) {
    try {
      console.log('checkToken: about to delete token.json');
      await deleteFile(TOKEN_PATH);
    }
    catch (ex) {
      console.log('checkToken: unable to delete file');
      console.log(ex);
    }
    console.log('checkToken: about to redirect');
    redirectToAuth(oauth2Client);
  }
}

const redirectToAuth = (oauth2Client) => {
  console.log('redirectToAuth: IN');
  // grab the url that will be used for authorization
  const authorizeUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES.join(' '),
    include_granted_scopes: true
  });
  console.log('redirectToAuth:', authorizeUrl);
  console.log('redirectToAuth: redirecting');
  // open the browser to the authorize url to start the workflow
  opn(authorizeUrl, { wait: false }).then(cp => cp.unref());
  console.log('redirectToAuth: redirected');
}

module.exports = {
  authCheck,
  checkToken,
  redirectToAuth,
  isTokenUnavailable
}
