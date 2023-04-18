const { authorize, redirectToAuth } = require('../auth/google');
const { TOKEN_PATH } = require('./constants');
const fs = require('fs');
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
      else {
        resolve(false);
      }
    });
  });
  return tokenUnavailable;
}

const checkToken = async (oauth2Client) => {
  const tokenUnavailable = await isTokenUnavailable();
  if (oauth2Client.isTokenExpiring() || tokenUnavailable) {
    try {
      await deleteFile(TOKEN_PATH);
    }
    catch (ex) {
      console.log(ex);
    }
    redirectToAuth(oauth2Client);
  }
}



module.exports = {
  authCheck,
  checkToken,
  isTokenUnavailable
}
