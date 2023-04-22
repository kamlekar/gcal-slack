import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/authentication/auth.module';
import { DriveModule } from './modules/drive/drive.module';
import { GoogleAuthService } from './services/googleAuth';

@Module({
  imports: [AuthModule, DriveModule],
  controllers: [AppController],
  providers: [AppService, GoogleAuthService],
})
export class AppModule {}
