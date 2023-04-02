const { calendarEventWatchCallback } = require('./integrations/calendar/events/triggers');
const { debounce } = require('lodash');
const { watchCalendarEvents } = require('./integrations/calendar/events/watch');
const { listEvents } = require('./integrations/calendar/events/fetch');
const { driveRoutes } = require('./integrations/drive');
const { deleteFile } = require('./common/utils');
const { TOKEN_PATH } = require('./common/constants');
const { auth } = require('./auth');

function initRoutes(app) {
  app.post('/calendar_events', debounce(calendarEventWatchCallback, 1000));

  app.get('/', (req, res) => res.sendFile(__dirname + '/pages/index.html'));

  app.get('/integrate', async (req, res) => {
    try {
      const authClient = auth.getClient();
      const events = await listEvents(authClient);
      console.log('Upcoming 10 events:');
      events.map((event, i) => {
        const start = event.start.dateTime || event.start.date;
        console.log(`${start} - ${event.summary}`);
      });

      watchCalendarEvents(authClient);
      res.sendFile(__dirname + '/pages/integrate.html');
    }
    catch (ex) {
      console.log(ex);
    }
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
