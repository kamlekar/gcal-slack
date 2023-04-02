const { google } = require('googleapis');
const moment = require('moment');

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listEvents(auth) {
  const calendar = google.calendar({
    version: 'v3',
    auth,
    params: {
      key: process.env.GOOGLE_API_KEY
    }
  });
  const res = await calendar.events.list({
    calendarId: 'primary',
    timeMin: moment().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  });
  const events = res.data.items;
  if (!events || events.length === 0) {
    console.log('No upcoming events found.');
    return;
  }

  return events;
}

// useful to set status
async function getRunningEvents(auth) {
  const events = await listEvents(auth);

  const currentlyRunningEvents = events.map((event) => {
    event.start.moment = moment(event.start.dateTime || event.start.date);
    event.end.moment = moment(event.end.dateTime || event.end.date);
    return event;
  }).filter((event) => {
    return moment().isBetween(event.start.moment, event.end.moment)
  });

  return currentlyRunningEvents;
}

// useful to set leaves
function getRecentlyUpdatedEvents() {

}

module.exports = {
  listEvents,
  getRunningEvents
};
