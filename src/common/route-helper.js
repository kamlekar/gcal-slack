const { authorize } = require('../auth/google');
const { TOKEN_PATH } = require('./constants');
const fs = require('fs');

function authCheck(req, res) {
  return new Promise((resolve, reject) => {
    authorize(req, function (authClient) {
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

module.exports = {
  authCheck,
  isTokenUnavailable
}
