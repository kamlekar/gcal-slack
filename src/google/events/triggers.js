const { setStatus } = require('../../slack/status/index');
const { authorize } = require('../auth/auth');
const { getRunningEvents } = require('../events/fetch');

function calendarEventWatchCallback(req, res) {
  try {
    const subscription = req.body;
    // res.status(201).json({});
    const payload = JSON.stringify({ title: "Hello World", body: "This is your first push notification" });
    authorize().then(async function (auth) {
      const events = await getRunningEvents(auth);
      events.forEach(event => {
        console.log("current event:", event.summary);
        setStatus(event.summary);
      });
    });
    console.log('subscription: ', JSON.stringify(subscription));
  }
  catch (ex) {
    console.log("error: ", ex);
  }
}

module.exports = {
  calendarEventWatchCallback
};
