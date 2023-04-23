# Setup & Usage

## Fetching new Google credentials

- Go to Google developer console
- Create a new project with any name
- Under Manage APIs, enable Google calendar API
- Under the same project, create new OAuth client ID credentials
- Generate a credentials.json file and place it in the root folder of this repo.

## Running locally on HTTPS

Since this app rely on Google calendars event watch subscription, it need the server to run on HTTPs.

### To run on HTTPS locally (_recommended_):

Generate SSL certificate on localhost

```
brew install mkcert
brew install nss # if you use Firefox
mkcert -install
mkcert localhost
```

Add `local.integrate.app` as alias to `127.0.0.1` in `/etc/hosts` on mac/linux. Similar setup steps can be found online for Windows OS.
Go to `local.integrate.app:3000` to see the view.

- [Ref link using mkcert](https://web.dev/how-to-use-local-https/)
- [Ref link for updating host file](https://www.howtogeek.com/27350/beginner-geek-how-to-edit-your-hosts-file/)

<b>OR</b>

### Use ngrok (_recommended only for testing calendar watch event_)

Install `ngrok`

```
npm i -g ngrok
```

Once installing `ngrok`, try the following to give a random url on HTTPS:

```
ngrok http https://local.integrate.app:3000 --host-header=rewrite
```

Copy the generated random HTTPS string URL into `.env` -> `HOST` property. And then run the server using `node .`. Go to ngrok generated url to view the UI.

## Create new Slack app

- Create a new Slack app from this page: https://api.slack.com/apps
- Copy the `src/slack/app-manifest.yaml` content to `App Manifest` tab under newly created app.
- Go to OAuth scopes in the same page and fill the env variables as the format mentioned in `.env.example` file.

## Running the app

Once above setup steps are done, run app using:

```
node .
```

Go to `local.integrate.app:3000` to see the view.

You can also run the app on VScode debugger. Select `webserver` script while debugging.

# Issues

## Refresh token not found

- Remove `gcal-slack` app access from this link: https://myaccount.google.com/u/0/permissions?pli=1
- Delete `token.json` from root folder
- Rerun the server

Further reading: [link](https://stackoverflow.com/a/10857806/1577396)
