const fs = require('fs');
const url = require('url');
const path = require('path');

const { google } = require('googleapis');
const { HOST } = require('../common/constants');

// If modifying these scopes, delete token.json.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), '/credentials.json');

function authorize(req, callback) {
  // Load client secrets from a local file.
  fs.readFile(CREDENTIALS_PATH, (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    const credentials = JSON.parse(content);

    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getNewToken(req, oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    });
  });

}

function getNewToken(req, oAuth2Client, callback) {
  if (req && req.url.indexOf('code=') > -1) {
    const qs = new url.URL(req.url, HOST)
      .searchParams;
    const code = qs.get('code')
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
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

module.exports = {
  authorize
}
