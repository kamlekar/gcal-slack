import { Module } from '@nestjs/common';
import { StatusService } from './services/status.service';
import { SlackController } from './controllers/slack.controller';
import { AuthModule } from '../authentication/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [SlackController],
  providers: [StatusService],
  exports: [StatusService],
})
export class SlackModule {}
