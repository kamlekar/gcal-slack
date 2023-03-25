const { calendarEventWatchCallback } = require('./integrations/calendar/events/triggers');
const { debounce } = require('lodash');
const { authorize } = require('./auth/google');
const { watchCalendarEvents } = require('./integrations/calendar/events/watch');
const { listEvents } = require('./integrations/calendar/events/fetch');

function authCheck(req, res) {
  return new Promise((resolve, reject) => {
    authorize(req, res).then(async function (authClient) {
      resolve(authClient);
    }).catch((e) => {
      console.error(e);
      res.sendFile(__dirname + '/pages/wrong.html');
    });
  });
}

function initRoutes(app) {
  app.post('/calendar_events', debounce(calendarEventWatchCallback, 1000));

  app.get('/', (req, res) => authCheck(req, res).then(() => res.sendFile(__dirname + '/pages/index.html')));

  app.get('/integrate', (req, res) => {
    authCheck(req, res).then(async function (auth) {
      const events = await listEvents(auth);
      console.log('Upcoming 10 events:');
      events.map((event, i) => {
        const start = event.start.dateTime || event.start.date;
        console.log(`${start} - ${event.summary}`);
      });

      watchCalendarEvents(auth);
      res.sendFile(__dirname + '/pages/integrate.html');
    });
  });
  app.get('/upload', (req, res) => res.sendFile(__dirname + '/pages/upload.html'));

  return app;
}

module.exports = {
  initRoutes
}
