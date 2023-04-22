import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as url from 'url';
import * as os from 'os';
import * as opn from 'open';
import { google } from 'googleapis';
import { OAuth2Client } from 'googleapis-common';
import { deleteFile } from 'src/services/utils/files.service';
import { Request, Response } from 'express';
import {
  CREDENTIALS_PATH,
  TOKEN_PATH,
  SCOPES,
  HOST,
} from 'src/common/constants';

@Injectable()
export class GoogleAuthService {
  getHello(): string {
    return 'Hello World!';
  }

  async authorize(req: Request, callback) {
    const oAuth2Client = await this.getAuthClient();
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) {
        console.log(err);
        return this.getNewToken(req, oAuth2Client, callback);
      }
      oAuth2Client.setCredentials(JSON.parse(token.toString()));
      callback(oAuth2Client);
    });
  }

  getNewToken(req: Request, oAuth2Client, callback) {
    console.log('request url', req.url);
    if (req && req.url.indexOf('code=') > -1) {
      const qs = new url.URL(req.url, HOST).searchParams;
      const code = qs.get('code');
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        if (!fs.existsSync(os.tmpdir())) {
          fs.mkdirSync(os.tmpdir());
        }
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log('Token stored to', TOKEN_PATH);
        });
        callback(oAuth2Client);
      });
    } else {
      callback(oAuth2Client);
    }
  }

  async getAuthClient(): Promise<OAuth2Client> {
    return new Promise((resolve, reject) => {
      // Load client secrets from a local file.
      fs.readFile(CREDENTIALS_PATH, (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        const credentials = JSON.parse(content.toString());

        const { client_secret, client_id, redirect_uris } = credentials.web;
        const defaultRedirectUri = `${HOST}/`;
        const redirect_uri =
          redirect_uris.find((f) => f.indexOf(HOST) > -1) || defaultRedirectUri;
        const oauth = new google.auth.OAuth2(
          client_id,
          client_secret,
          redirect_uri,
        );
        resolve(oauth);
      });
    });
  }

  generateAuthUrl(authClient) {
    return authClient.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES.join(' '),
      include_granted_scopes: true,
    });
  }

  redirectToAuth(oauth2Client) {
    // grab the url that will be used for authorization
    const authorizeUrl = this.generateAuthUrl(oauth2Client);
    // open the browser to the authorize url to start the workflow
    opn(authorizeUrl, { wait: false }).then((cp) => cp.unref());
  }

  authCheck(req: Request, res: Response) {
    return new Promise((resolve, reject) => {
      this.authorize(req, async function (authClient) {
        await this.checkToken(authClient);
        resolve(authClient);
      });
    });
  }

  async isTokenUnavailable() {
    const tokenUnavailable = await new Promise((resolve) => {
      // Check if we have previously stored a token.
      fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
    return tokenUnavailable;
  }

  async checkToken(oauth2Client) {
    const tokenUnavailable = await this.isTokenUnavailable();
    if (oauth2Client.isTokenExpiring() || tokenUnavailable) {
      try {
        await deleteFile(TOKEN_PATH);
      } catch (ex) {
        console.log(ex);
      }
      this.redirectToAuth(oauth2Client);
    }
  }
}
