import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { GoogleAuthService } from './modules/authentication/services/googleAuth.service';

@Controller()
export class AppController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}

  @Get()
  async getDashboard(@Req() req: Request, @Res() res: Response) {
    let requiredAuth = false;
    try {
      await this.googleAuthService.authCheck(req, res);
    } catch (ex) {
      requiredAuth = true;
    }
    res.render('views/pages/index.njk', {
      authUrl: this.googleAuthService.generateAuthUrl(
        await this.googleAuthService.getAuthClient(),
      ),
      requiredAuth,
    });
  }
}
