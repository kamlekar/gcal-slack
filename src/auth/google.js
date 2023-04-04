const fs = require('fs');
const url = require('url');
const os = require('os');
const opn = require('open');

const { google } = require('googleapis');
const { CREDENTIALS_PATH, TOKEN_PATH, SCOPES } = require('../common/constants');



function authorize(req, callback) {
  // Load client secrets from a local file.
  fs.readFile(CREDENTIALS_PATH, (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    const credentials = JSON.parse(content);

    const { client_secret, client_id } = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, process.env.GOOGLE_REDIRECT_URI
    );
    console.log('token_path is:', TOKEN_PATH);
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) {
        console.log(err);
        return getNewToken(req, oAuth2Client, callback);
      }
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    });
  });

}

function getNewToken(req, oAuth2Client, callback) {
  console.log('hostname is:', req.headers.host);
  console.log('request url', req.url);
  if (req && req.url.indexOf('code=') > -1) {
    const qs = new url.URL(req.url, 'https://' + req.headers.host)
      .searchParams;
    const code = qs.get('code');
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      if (!fs.existsSync(os.tmpdir())) {
        fs.mkdirSync(os.tmpdir());
      }
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  }
  else {
    callback(oAuth2Client);
  }

}

const getAuthClient = async () => {
  return new Promise((resolve, reject) => {
    fs.readFile(CREDENTIALS_PATH, (err, content) => {
      if (err) return console.log('Error loading client secret file:', err);
      const credentials = JSON.parse(content);
      const { client_secret, client_id } = credentials.web;
      const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, process.env.GOOGLE_REDIRECT_URI
      );
      resolve(oAuth2Client);
    });
  })
}

const generateAuthUrl = (authClient) => {
  return authClient.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES.join(' '),
    include_granted_scopes: true
  })
}

const redirectToAuth = (oauth2Client) => {
  // grab the url that will be used for authorization
  const authorizeUrl = generateAuthUrl(oauth2Client);
  // open the browser to the authorize url to start the workflow
  opn(authorizeUrl, { wait: false }).then(cp => cp.unref());
}

module.exports = {
  authorize,
  getAuthClient,
  generateAuthUrl,
  redirectToAuth
}
