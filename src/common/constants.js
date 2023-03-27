module.exports = {
  // use ngrok to have a https url so the web push notifications work
  HOST: `${process.env.HOST}`,
  // @NOTE: If modifying these scopes, delete token.json.
  SCOPES: [
    'https://www.googleapis.com/auth/calendar.readonly',
    // https://developers.google.com/identity/protocols/oauth2/scopes
    'https://www.googleapis.com/auth/drive'
  ]
}
