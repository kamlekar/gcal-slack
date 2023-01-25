const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const { initRoutes } = require('./src/routes');
const { PORT } = require('./src/common/constants');
const { watchCalendarEvents } = require('./src/google/events/watch');
const { listEvents } = require('./src/google/events/fetch');
const { authorize } = require('./src/google/auth/auth');

// Create express app.
const app = express();

// Use body parser which we will use to parse request body that sending from client.
app.use(bodyParser.json());

// We will store our client files in ./client directory.
app.use(express.static(path.join(__dirname, "client")));

initRoutes(app);

authorize().then(async function (auth) {
  const events = await listEvents(auth);
  console.log('Upcoming 10 events:');
  events.map((event, i) => {
    const start = event.start.dateTime || event.start.date;
    console.log(`${start} - ${event.summary}`);
  });

  watchCalendarEvents(auth);
}).catch(console.error);

app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});
