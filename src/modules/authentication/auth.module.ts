import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { GoogleAuthService } from './services/googleAuth.service';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [GoogleAuthService],
})
export class AuthModule {}
