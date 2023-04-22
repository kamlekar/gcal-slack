import * as path from 'path';
import * as os from 'os';

const temp_path = process.env.LOCAL ? process.cwd() : os.tmpdir();
// @NOTE: If modifying these scopes, delete token.json.
export const SCOPES = [
  'https://www.googleapis.com/auth/calendar.readonly',
  // https://developers.google.com/identity/protocols/oauth2/scopes
  'https://www.googleapis.com/auth/drive',
];
// If modifying these scopes, delete token.json.
export const TOKEN_PATH = path.join(temp_path, 'token.json');
export const CREDENTIALS_PATH = path.join(process.cwd(), '/credentials.json');
