import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { GoogleAuthService } from 'src/services/googleAuth';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [GoogleAuthService],
})
export class AuthModule {}
