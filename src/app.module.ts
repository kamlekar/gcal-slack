import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/authentication/auth.module';
import { DriveModule } from './modules/drive/drive.module';
import { CalendarModule } from './modules/calendar/calendar.module';
import { SlackModule } from './modules/slack/slack.module';
import { ExpensesModule } from './modules/expenses/expenses.module';

@Module({
  imports: [AuthModule, DriveModule, CalendarModule, SlackModule, ExpensesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
