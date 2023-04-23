import { Module } from '@nestjs/common';
import { EventsService } from './services/events.service';
import { TriggersService } from './services/triggers.service';
import { WatchService } from './services/watch.service';
import { SlackModule } from '../slack/slack.module';
import { AuthModule } from '../authentication/auth.module';

@Module({
  imports: [SlackModule, AuthModule],
  controllers: [],
  providers: [EventsService, TriggersService, WatchService],
  exports: [],
})
export class CalendarModule {}
