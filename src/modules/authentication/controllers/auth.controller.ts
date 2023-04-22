import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { GoogleAuthService } from '../services/googleAuth.service';

@Controller()
export class AuthController {
  constructor(private googleAuthService: GoogleAuthService) {}

  @Get('/getAuthUrl')
  submitUploadForm(@Req() req: Request, @Res() res: Response) {
    this.googleAuthService.getAuthClient().then((authClient) => {
      res.end(
        JSON.stringify({
          url: this.googleAuthService.generateAuthUrl(authClient),
        }),
      );
    });
  }
}
