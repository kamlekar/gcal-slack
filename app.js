const express = require('express');
const os = require('os');
const fileUpload = require('express-fileupload');

// Create express app.
const app = express();
// default options
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: `${os.tmpdir()}/`
}));
app.use(express.static('public'));
// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ extended: true, limit: "200mb" }));

module.exports = {
  app
};
