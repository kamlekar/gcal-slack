const { authorize } = require('../auth/google');

function authCheck(req, res) {
  return new Promise((resolve, reject) => {
    authorize(req, function (authClient) {
      authClient.off('tokens', () => { });
      authClient.on('tokens', (tokens) => {
        if (tokens.refresh_token) {
          // grab the url that will be used for authorization
          const authorizeUrl = authClient.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES.join(' '),
            include_granted_scopes: true
          });

          // open the browser to the authorize url to start the workflow
          opn(authorizeUrl, { wait: false }).then(cp => cp.unref());
        }
        console.log(tokens.access_token);
      });

      resolve(authClient);
    });
  });
}

module.exports = {
  authCheck
}
