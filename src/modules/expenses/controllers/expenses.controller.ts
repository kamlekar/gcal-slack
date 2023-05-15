import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express-serve-static-core';
import { GoogleAuthService } from '../../authentication/services/googleAuth.service';

@Controller()
export class ExpensesController {
  constructor(
    private googleAuthService: GoogleAuthService,
  ) {}

  @Get('/expenses')
  async getExpenses(@Req() req: Request, @Res() res: Response) {
    let requiredAuth = false;
    try {
      await this.googleAuthService.authCheck(req, res);
    } catch (ex) {
      requiredAuth = true;
    }

    res.render('pages/expenses/index.njk', {
      authUrl: this.googleAuthService.generateAuthUrl(
        await this.googleAuthService.getAuthClient(),
      ),
      requiredAuth,
    });
  }
}
