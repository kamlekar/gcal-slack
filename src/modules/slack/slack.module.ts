import { Module } from '@nestjs/common';
import { StatusService } from './services/status.service';

@Module({
  imports: [],
  controllers: [],
  providers: [StatusService],
  exports: [StatusService],
})
export class SlackModule {}
