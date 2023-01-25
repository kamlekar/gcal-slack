const {google} = require('googleapis');
const { v4: uuidv4 } = require('uuid');
const { HOST } = require('./constants.js');

let channelId;
let channelResourceId;

async function watchCalendarEvents(auth) {
  const calendar = google.calendar({version: 'v3', auth});
  var channel = {
    id: uuidv4(),
    type: 'web_hook',
    address: `${HOST}/calendar_events`
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
  const calendar = google.calendar({version: 'v3', auth});

  calendar.channels.stop({
    id: channelId,
    resourceId: channelResourceId
  });
}

module.exports = {
  watchCalendarEvents,
  stopWatchingCalendarEvents
}
