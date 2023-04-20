import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as dotenv from 'dotenv';
import { join } from 'path';
import * as nunjucks from 'nunjucks';
import { AppModule } from './app.module';

dotenv.config();

const ROOT_DIR: string = join(__dirname, '..');
const IS_PRODUCTION: boolean = process.env.LOCAL !== 'true';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule);
  const port = 3000;
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
