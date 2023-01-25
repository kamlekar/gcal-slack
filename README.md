## Setup & Usage

### Fetching new Google credentials
- Go to Google developer console
- Create a new project with any name
- Under Manage APIs, enable Google calendar API 
- Under the same project, create new OAuth client ID credentials
- Generate a credentials.json file and place it in the root folder of this repo.

### Running locally on HTTPS
Since this app rely on Google calendars event watch subscription, it may need the server to run on HTTPs. 
To run on HTTPS locally, we can use `ngrok`. Once installing `ngrok`, try the following to give a random url on HTTPS:

```
ngrok http 3000
```

Copy the generated random string URL into `src/common/constants.js` -> `HOST` property.

### Running the app
Once above setup steps are done, run app using:
```
node .
```
