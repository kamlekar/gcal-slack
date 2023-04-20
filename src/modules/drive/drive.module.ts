import { Module } from '@nestjs/common';
import { DriveController } from './controllers/drive.controller';
import { UploadService } from './services/upload.service';

@Module({
  imports: [],
  controllers: [DriveController],
  providers: [UploadService],
})
export class AppModule {}
