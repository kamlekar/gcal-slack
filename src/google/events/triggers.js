const { setStatus, clearStatus } = require('../../slack/status/index');
const { authorize } = require('../auth/auth');
const { getRunningEvents } = require('../events/fetch');

function calendarEventWatchCallback(req, res) {
  try {
    const subscription = req.body;

    authorize().then(async function (auth) {
      const events = await getRunningEvents(auth);
      events.forEach(event => {
        console.log("current event:", event.summary);
        setStatus(event.summary, event.end.moment);
      });

      if (events.length === 0) {
        clearStatus();
      }
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
