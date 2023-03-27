const { authorize, goToAuthUrl } = require('../auth/google');
const fs = require('fs');
const { TOKEN_PATH } = require('./constants');

function authCheck(req, res) {
  return new Promise((resolve, reject) => {
    authorize(req, function (authClient) {
      hasAuthenticated(authClient).then((isAuthenticated) => {
        if (!isAuthenticated) {
          goToAuthUrl(authClient);
        }
      });

      resolve(authClient);
    });
  });
}

function hasAuthenticated(authClient) {
  return new Promise((resolve, reject) => {
    authClient.off('tokens', () => { });
    authClient.on('tokens', (tokens) => {
      if (tokens.refresh_token) {
        resolve(true);
      }
      else {
        fs.readFile(TOKEN_PATH, (err, token) => {
          if (err) {
            resolve(false);
          }
          else {
            resolve(true);
          }
        });
      }
    });
  })
}

module.exports = {
  authCheck,
  hasAuthenticated
}
