function calendarEventWatchCallback(req, res) {
  try {
    const subscription = req.body;
    // res.status(201).json({});
    const payload = JSON.stringify({ title: "Hello World", body: "This is your first push notification" });
    console.log('subscription: ', JSON.stringify(subscription));
  }
  catch (ex) {
    console.log("error: ", ex);
  }
}

module.exports = {
  calendarEventWatchCallback
};
