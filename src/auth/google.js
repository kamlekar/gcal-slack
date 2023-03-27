const fs = require('fs');
const url = require('url');
const opn = require('open');

const { google } = require('googleapis');
const { HOST, TOKEN_PATH, CREDENTIALS_PATH, SCOPES } = require('../common/constants');

function authorize(req, callback) {
  getCredentials().then((credentials) => {
    const { client_secret, client_id, redirect_uris } = credentials;
    const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);
    getToken(req, oAuth2Client).then((token) => {
      oAuth2Client.setCredentials(JSON.stringify(token));
      callback(oAuth2Client);
    }).catch((oAuth2Client) => {
      goToAuthUrl(oAuth2Client);
    });
  }).catch((credentialsError) => console.log('Error loading client secret file:', credentialsError));
}

function getCredentials() {
  return new Promise((resolve, reject) => {
    fs.readFile(CREDENTIALS_PATH, (err, content) => {
      if (err) {
        reject(err);
      }
      else {
        const credentials = JSON.parse(content);

        const { client_secret, client_id, redirect_uris } = credentials.web;
        resolve({ client_secret, client_id, redirect_uris });
      }
    });
  })
}

function getToken(req, oAuth2Client) {
  return new Promise((resolve, reject) => {
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (noTokenError, token) => {
      if (noTokenError) {
        if (isAuthCodeAvailable(req)) {
          getNewToken(req, oAuth2Client, (newToken) => {
            resolve(newToken);
          });
        }
        else {
          reject(oAuth2Client);
        }
      }
      else {
        resolve(JSON.parse(token.toString()));
      }
    });
  })
}

function isAuthCodeAvailable(req) {
  return (req.url.indexOf('code=') > -1);
}

function getNewToken(req, oAuth2Client, callback) {
  const qs = new url.URL(req.url, HOST).searchParams;
  const code = qs.get('code')
  oAuth2Client.getToken(code, (err, token) => {
    if (err) return console.error('Error retrieving access token', err);
    // Store the token to disk for later program executions
    fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
      if (err) return console.error(err);
      console.log('Token stored to', TOKEN_PATH);
      callback(token);
    });
  });
}

function goToAuthUrl(authClient) {
  // grab the url that will be used for authorization
  const authorizeUrl = authClient.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES.join(' '),
    include_granted_scopes: true
  });

  // open the browser to the authorize url to start the workflow
  opn(authorizeUrl, { wait: false }).then(cp => cp.unref());
}

module.exports = {
  authorize,
  goToAuthUrl
}
