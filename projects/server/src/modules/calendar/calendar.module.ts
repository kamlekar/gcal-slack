import { Module } from '@nestjs/common';
import { EventsService } from './services/events.service';
import { TriggersService } from './services/triggers.service';
import { WatchService } from './services/watch.service';
import { SlackModule } from '../slack/slack.module';
import { AuthModule } from '../authentication/auth.module';
import { CalendarController } from './controllers/calendar.controller';

@Module({
  imports: [SlackModule, AuthModule],
  controllers: [CalendarController],
  providers: [EventsService, TriggersService, WatchService],
  exports: [],
})
export class CalendarModule {}
