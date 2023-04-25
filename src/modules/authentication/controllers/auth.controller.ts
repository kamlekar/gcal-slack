import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { GoogleAuthService } from '../services/googleAuth.service';
import { deleteFile } from 'src/services/utils/files.service';

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

  @Get('/clearToken')
  async clearToken(@Res() res: Response) {
    await deleteFile(this.googleAuthService.tokenPath);
    res.end('done');
  }

  @Get('/auth')
  async goToAuth(@Res() res: Response) {
    res.render('views/pages/authenticate/index.njk', {
      authUrl: this.googleAuthService.generateAuthUrl(
        await this.googleAuthService.getAuthClient(),
      ),
    });
  }
}
