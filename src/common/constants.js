const path = require('path');
const os = require('os');

const temp_path = process.env.LOCAL ? process.cwd() : os.tmpdir();
module.exports = {
  // use ngrok to have a https url so the web push notifications work
  HOST: `${process.env.HOST}`,
  // @NOTE: If modifying these scopes, delete token.json.
  SCOPES: [
    'https://www.googleapis.com/auth/calendar.readonly',
    // https://developers.google.com/identity/protocols/oauth2/scopes
    'https://www.googleapis.com/auth/drive'
  ],
  // If modifying these scopes, delete token.json.
  TOKEN_PATH: path.join(temp_path, 'token.json'),
  CREDENTIALS_PATH: path.join(process.cwd(), '/credentials.json'),
}
