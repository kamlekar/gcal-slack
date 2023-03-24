module.exports = {
  // use ngrok to have a https url so the web push notifications work
  HOST: `${process.env.HOST}`,
  // If modifying these scopes, delete token.json.
  SCOPES: [
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/drive.metadata.readonly'
  ]
}
