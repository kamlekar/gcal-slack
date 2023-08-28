import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/authentication/auth.module';
import { DriveModule } from './modules/drive/drive.module';
import { CalendarModule } from './modules/calendar/calendar.module';
import { SlackModule } from './modules/slack/slack.module';

@Module({
  imports: [AuthModule, DriveModule, CalendarModule, SlackModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
