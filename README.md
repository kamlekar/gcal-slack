## Setup & Usage

### Fetching new Google credentials
- Go to Google developer console
- Create a new project with any name
- Under Manage APIs, enable Google calendar API 
- Under the same project, create new OAuth client ID credentials
- Generate a credentials.json file and place it in the root folder of this repo.

### Running locally on HTTPS
Since this app rely on Google calendars event watch subscription, it need the server to run on HTTPs. 

To run on HTTPS locally, we can use `ngrok`. Once installing `ngrok`, try the following to give a random url on HTTPS:

```
ngrok http 3000
```

Copy the generated random HTTPS string URL into `src/common/constants.js` -> `HOST` property.

<b>OR</b>

Generate SSL certificate on localhost and run on a [http-server](https://www.npmjs.com/package/http-server)


```
brew install mkcert
brew install nss # if you use Firefox
mkcert -install
mkcert localhost

npm i http-server -g
http-server ./ --ssl true --cert localhost.pem --key localhost-key.pem
```

- [Ref Link using mkcert](https://web.dev/how-to-use-local-https/)

### Create new Slack app
- Create a new Slack app from this page: https://api.slack.com/apps
- Copy the `src/slack/app-manifest.yaml` content to `App Manifest` tab under newly created app.
- Go to OAuth scopes in the same page and fill the env variables as the format mentioned in `.env.example` file.

### Running the app
Once above setup steps are done, run app using:
```
node .
```
