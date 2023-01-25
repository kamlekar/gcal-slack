module.exports = function subscribe(app) {
  console.log("Subscribed");

  app.post('/calendar_events', (req, res) => {
    try {
      const subscription = req.body;
      res.status(201).json({});
      const payload = JSON.stringify({ title: "Hello World", body: "This is your first push notification" });
      console.log('subscription: ', subscription);
    }
    catch (ex) {
      console.log("error: ", ex);
    }
  });
  
  return app;
}
