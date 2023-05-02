/* eslint-disable @typescript-eslint/no-var-requires */
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import path, { join } from 'path';
import { AppModule } from './app.module';

import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as os from 'os';
import fileUpload from 'express-fileupload';
import nunjucks from 'nunjucks';

dotenv.config();

const ROOT_DIR: string = join(__dirname, '..');
// @TODO: pass proper production flag here
const IS_PRODUCTION: boolean = process.env.LOCAL !== 'true';
const IS_LOCAL: boolean = process.env.LOCAL === 'true';

async function bootstrap() {
  const app: NestExpressApplication = IS_LOCAL
    ? await NestFactory.create(AppModule, {
        httpsOptions: {
          key: fs.readFileSync(ROOT_DIR + '/localhost-key.pem'),
          cert: fs.readFileSync(ROOT_DIR + '/localhost.pem'),
        },
      })
    : await NestFactory.create(AppModule);

  app.use(
    fileUpload({
      useTempFiles: true,
      tempFileDir: `${os.tmpdir()}/`,
    }),
  );

  const port = process.env.PORT;

  // Ref: https://blog.devgenius.io/multiple-page-application-mpa-in-nest-js-with-nunjucks-1fd522cc1aa
  const opts = {
    express: app,
    autoescape: true,
    watch: !IS_PRODUCTION,
    noCache: !IS_PRODUCTION,
  };

  nunjucks.configure(path.resolve(__dirname, 'views'), opts);

  app.enableCors();
  app.set('trust proxy', 1);
  app.set('view engine', 'njk');

  await app.listen(port, () => {
    console.log(`server running on ${port}`);
  });
}

bootstrap();
