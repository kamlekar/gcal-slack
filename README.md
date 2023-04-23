<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

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
