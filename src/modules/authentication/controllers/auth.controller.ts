import { Controller, Get, Req, Res } from '@nestjs/common';
import { GoogleAuthService } from 'src/services/googleAuth';
import { Request, Response } from 'express';

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
