const { calendarEventWatchCallback } = require('./integrations/calendar/events/triggers');
const { debounce } = require('lodash');
const { watchCalendarEvents } = require('./integrations/calendar/events/watch');
const { listEvents } = require('./integrations/calendar/events/fetch');
const { driveRoutes } = require('./integrations/drive');
const { authCheck } = require('./common/route-helper');
const { deleteFile } = require('./common/utils');
const { TOKEN_PATH } = require('./common/constants');

function initRoutes(app) {
  app.post('/calendar_events', debounce(calendarEventWatchCallback, 1000));

  app.get('/', (req, res) => authCheck(req, res).then(() => res.sendFile(__dirname + '/pages/index.html')));

  app.get('/integrate', (req, res) => {
    authCheck(req, res).then(async function (auth) {
      try {
        const events = await listEvents(auth);
        console.log('Upcoming 10 events:');
        events.map((event, i) => {
          const start = event.start.dateTime || event.start.date;
          console.log(`${start} - ${event.summary}`);
        });

        watchCalendarEvents(auth);
        res.sendFile(__dirname + '/pages/integrate.html');
      }
      catch (ex) {
        console.log(ex);
      }
    });
  });
  app.get('/upload', (req, res) => res.sendFile(__dirname + '/pages/upload.html'));

  app.get('/clearToken', async (req, res) => {
    await deleteFile(TOKEN_PATH);
    res.end('done');
  });

  driveRoutes(app);

  return app;
}

module.exports = {
  initRoutes
}
