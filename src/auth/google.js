// Copyright 2012 Google LLC
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const fs = require('fs');
const path = require('path');
const url = require('url');

const { google } = require('googleapis');
const { HOST } = require('../common/constants');
const plus = google.plus('v1');

/**
 * To use OAuth2 authentication, we need access to a a CLIENT_ID, CLIENT_SECRET, AND REDIRECT_URI.  To get these credentials for your application, visit https://console.cloud.google.com/apis/credentials.
 */
const keyPath = path.join(__dirname, '../../credentials.json');
let keys = { redirect_uris: [''] };
if (fs.existsSync(keyPath)) {
  keys = require(keyPath).web;
}

/**
 * Create a new OAuth2 client with the configured keys.
 */
const oauth2Client = new google.auth.OAuth2(
  keys.client_id,
  keys.client_secret,
  keys.redirect_uris[0]
);

/**
 * This is one of the many ways you can configure googleapis to use authentication credentials.  In this method, we're setting a global reference for all APIs.  Any other API you use here, like google.drive('v3'), will now use this auth client. You can also override the auth client at the service and method call levels.
 */
google.options({ auth: oauth2Client });

/**
 * Open an http server to accept the oauth callback. In this simple example, the only request to our webserver is to /callback?code=<code>
 */
async function authenticate(req, res) {
  return new Promise(async (resolve, reject) => {
    try {
      if (req.url.indexOf('code=') > -1) {
        const qs = new url.URL(req.url, HOST)
          .searchParams;
        const { tokens } = await oauth2Client.getToken(qs.get('code'));
        oauth2Client.credentials = tokens; // eslint-disable-line require-atomic-updates
      }
      resolve(oauth2Client);
    } catch (e) {
      reject(e);
    }
  });
}

// @NOTE: For reference
// async function runSample() {
//   // retrieve user profile
//   const res = await plus.people.get({ userId: 'me' });
//   console.log(res.data);
// }

// authenticate()
//   .then(client => runSample(client))
//   .catch(console.error);

module.exports = {
  authorize: authenticate,
  oauth2Client: oauth2Client
}
