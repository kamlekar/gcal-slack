const { google } = require('googleapis');
const { v4: uuidv4 } = require('uuid');
const { HOST } = require('../../../common/constants.js');

let channelId;
let channelResourceId;

// Responsible to initiate trigger if any event is created/updated/deleted 
// In Google calendar irrespective of event date
async function watchCalendarEvents(auth) {
  const calendar = google.calendar({
    version: 'v3',
    params: {
      key: process.env.GOOGLE_API_KEY
    },
    auth
  });
  var channel = {
    id: uuidv4(),
    type: 'web_hook',
    address: `${HOST}/calendar_events`  // triggers callback
  }

  const response = await calendar.events.watch({
    calendarId: 'primary',
    resource: channel,
  });

  console.log(response);

  channelId = response.data.id;
  channelResourceId = response.data.resourceId;
}

function stopWatchingCalendarEvents(auth) {
  const calendar = google.calendar({
    version: 'v3',
    params: {
      key: process.env.GOOGLE_API_KEY
    },
    auth
  });

  calendar.channels.stop({
    id: channelId,
    resourceId: channelResourceId
  });
}

module.exports = {
  watchCalendarEvents,
  stopWatchingCalendarEvents
}
