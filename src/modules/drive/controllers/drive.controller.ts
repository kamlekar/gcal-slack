import { Controller, Post, Req, Res } from '@nestjs/common';
import { UploadService } from '../services/upload.service';
import { Request, Response } from 'express';
import { GoogleAuthService } from 'src/modules/authentication/services/googleAuth.service';

@Controller()
export class DriveController {
  constructor(
    private uploadService: UploadService,
    private googleAuthService: GoogleAuthService,
  ) {}

  @Post('/drive/upload')
  submitUploadForm(@Req() req: Request, @Res() res: Response) {
    this.googleAuthService.authCheck(req, res).then((authClient) => {
      this.uploadService.uploadFile(req, res, authClient).then((files) => {
        res.end(JSON.stringify(files));
      });
    });
  }
}
