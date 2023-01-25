const {calendarEventWatchCallback} = require('./google/events/triggers');
const {debounce} = require('lodash');

function initRoutes(app) {
  app.post('/calendar_events', debounce(calendarEventWatchCallback, 1000));
  
  return app;
}

module.exports = {
  initRoutes
}
