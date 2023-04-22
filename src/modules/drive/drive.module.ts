import { Module } from '@nestjs/common';
import { DriveController } from './controllers/drive.controller';
import { UploadService } from './services/upload.service';
import { GoogleAuthService } from 'src/services/googleAuth';

@Module({
  imports: [],
  controllers: [DriveController],
  providers: [UploadService, GoogleAuthService],
})
export class DriveModule {}
