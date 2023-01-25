const {calendarEventWatchCallback} = require('./triggers');
const {debounce} = require('lodash');

module.exports = function subscribe(app) {
  console.log("Subscribed");

  app.post('/calendar_events', debounce(calendarEventWatchCallback, 1000));
  
  return app;
}
