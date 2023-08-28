import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { UploadService } from '../services/upload.service';
import { Request, Response } from 'express-serve-static-core';
import { GoogleAuthService } from '../../authentication/services/googleAuth.service';

@Controller()
export class DriveController {
  constructor(
    private uploadService: UploadService,
    private googleAuthService: GoogleAuthService,
  ) {}

  @Get('/upload')
  async getUploadForm(@Req() req: Request, @Res() res: Response) {
    let requiredAuth = false;
    try {
      await this.googleAuthService.authCheck(req, res);
    } catch (ex) {
      requiredAuth = true;
    }

    res.render('pages/drive/upload.njk', {
      authUrl: this.googleAuthService.generateAuthUrl(
        await this.googleAuthService.getAuthClient(),
      ),
      requiredAuth,
    });
  }

  @Post('/drive/upload')
  submitUploadForm(@Req() req: Request, @Res() res: Response) {
    this.googleAuthService.authCheck(req, res).then((authClient) => {
      this.uploadService
        .uploadFile(req, res, authClient)
        .then((files) => {
          res.end(JSON.stringify(files));
        })
        .catch((ex) => console.log(ex));
    });
  }
}
