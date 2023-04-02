const fs = require('fs');
const url = require('url');

const { google } = require('googleapis');
const { CREDENTIALS_PATH, TOKEN_PATH } = require('../common/constants');



function authorize(req, callback) {
  // Load client secrets from a local file.
  fs.readFile(CREDENTIALS_PATH, (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    const credentials = JSON.parse(content);

    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]
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
  if (req && req.url.indexOf('code=') > -1) {
    const qs = new url.URL(req.url, 'https://' + req.headers.host)
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
