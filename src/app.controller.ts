import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { GoogleAuthService } from './modules/authentication/services/googleAuth.service';

@Controller()
export class AppController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}

  @Get()
  getDashboard(@Req() req: Request, @Res() res: Response) {
    this.googleAuthService.authCheck(req, res).then(async (authClient) => {
      res.render('views/pages/index.njk');
    });
  }
}
