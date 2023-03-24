const { calendarEventWatchCallback } = require('./google/events/triggers');
const { debounce } = require('lodash');

function initRoutes(app) {
  app.post('/calendar_events', debounce(calendarEventWatchCallback, 1000));

  app.get('/', (_, response) => response.sendFile(__dirname + '/pages/index.html'));
  app.get('/integrate', (_, response) => response.sendFile(__dirname + '/pages/integrate.html'))
  app.get('/upload', (_, response) => response.sendFile(__dirname + '/pages/upload.html'));

  return app;
}

module.exports = {
  initRoutes
}
