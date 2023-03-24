const path = require('path');
require('dotenv').config();
const process = require('process');
const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');
const { initRoutes } = require('./src/routes');
const { watchCalendarEvents } = require('./src/integrations/calendar/events/watch');
const { listEvents } = require('./src/integrations/calendar/events/fetch');
const { authorize } = require('./src/auth/google');

// Create express app.
const app = express();

const PORT = process.env.PORT;

const options = {
  key: fs.readFileSync('localhost-key.pem'),
  cert: fs.readFileSync('localhost.pem')
};

https.createServer(options, app).listen(PORT);

// Use body parser which we will use to parse request body that sending from client.
app.use(bodyParser.json());

// We will store our client files in ./client directory.
app.use(express.static(path.join(__dirname, 'client')));

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
