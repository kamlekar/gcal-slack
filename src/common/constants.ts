/* eslint-disable @typescript-eslint/no-var-requires */
import * as path from 'path';

// @NOTE: If modifying these scopes, delete token.json.
export const SCOPES = [
  'https://www.googleapis.com/auth/calendar.readonly',
  // https://developers.google.com/identity/protocols/oauth2/scopes
  'https://www.googleapis.com/auth/drive',
];
// If modifying these scopes, delete token.json.
export const CREDENTIALS_PATH = path.join(process.cwd(), '/credentials.json');
