import { Module } from '@nestjs/common';
import { DriveController } from './controllers/drive.controller';
import { UploadService } from './services/upload.service';
import { AuthModule } from '../authentication/auth.module';
import { GoogleAuthService } from '../authentication/services/googleAuth.service';

@Module({
  imports: [AuthModule],
  controllers: [DriveController],
  providers: [UploadService, GoogleAuthService],
})
export class DriveModule {}
