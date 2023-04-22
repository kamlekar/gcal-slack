import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { GoogleAuthService } from './services/googleAuth.service';
import { CREDENTIALS_PATH, SCOPES } from 'src/common/constants';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [
    GoogleAuthService,
    {
      useValue: CREDENTIALS_PATH,
      provide: 'CREDENTIALS_PATH',
    },
    {
      useValue: SCOPES,
      provide: 'SCOPES',
    },
  ],
  exports: [GoogleAuthService],
})
export class AuthModule {}
