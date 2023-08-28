import { Module } from '@nestjs/common';
import { DriveController } from './controllers/drive.controller';
import { UploadService } from './services/upload.service';
import { AuthModule } from '../authentication/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [DriveController],
  providers: [UploadService],
})
export class DriveModule {}
