import {
  Controller,
  Post,
  UploadedFile,
  Body,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DriveService } from './drive.service';

@Controller('drive')
export class DriveController {
  constructor(private readonly driveService: DriveService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('patientName') patientName: string,
    @Body('hospital') hospital: string,
    @Body('ailments') ailments: string,
  ) {
    if (!file || !patientName || !hospital || !ailments) {
      throw new HttpException(
        'Missing required fields: file, patientName, hospital, ailments',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      return await this.driveService.uploadFile(
        file,
        patientName,
        hospital,
        ailments,
      );
    } catch (error) {
      throw new HttpException(
        { message: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('shortcut')
  async createShortcut(
    @Body() file: { id: string; name: string; mimeType: string },
  ) {
    if (!file || !file.id || !file.name || !file.mimeType) {
      throw new HttpException(
        'Missing required fields: id, name, mimeType',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      return await this.driveService.createShortcut(file);
    } catch (error) {
      throw new HttpException(
        { message: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
