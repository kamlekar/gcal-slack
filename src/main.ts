import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as dotenv from 'dotenv';
import { join } from 'path';
import * as nunjucks from 'nunjucks';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as os from 'os';
import * as fileUpload from 'express-fileupload';

dotenv.config();

const ROOT_DIR: string = join(__dirname, '..');
const IS_PRODUCTION: boolean = process.env.LOCAL !== 'true';

async function bootstrap() {
  const options = {
    key: fs.readFileSync(ROOT_DIR + '/localhost-key.pem'),
    cert: fs.readFileSync(ROOT_DIR + '/localhost.pem'),
  };
  const app: NestExpressApplication = await NestFactory.create(AppModule, {
    httpsOptions: options,
  });

  app.use(
    fileUpload({
      useTempFiles: true,
      tempFileDir: `${os.tmpdir()}/`,
    }),
  );

  const port = process.env.PORT;
  const opts: nunjucks.ConfigureOptions = {
    express: app,
    autoescape: true,
    watch: !IS_PRODUCTION,
    noCache: !IS_PRODUCTION,
  };

  nunjucks.configure(join(ROOT_DIR, IS_PRODUCTION ? 'dist' : 'src'), opts);

  app.enableCors();
  app.set('trust proxy', 1);
  app.set('view engine', 'njk');

  await app.listen(port, () => {
    console.log(`server running on ${port}`);
  });
}
bootstrap();
