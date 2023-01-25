const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const subscribe = require('./subscribe');
const { watchCalendarEvents } = require('./watchCalendarEvents');
const { PORT } = require('./constants');
const listEvents = require('./listEvents');
const { authorize } = require('./auth');

// Create express app.
const app = express();

// Use body parser which we will use to parse request body that sending from client.
app.use(bodyParser.json());

// We will store our client files in ./client directory.
app.use(express.static(path.join(__dirname, "client")));

subscribe(app);

authorize().then(function(auth) {
  listEvents(auth);
  watchCalendarEvents(auth);
}).catch(console.error);

app.listen(PORT, () => {
    console.log("Server started on port " + PORT);
});
