import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { TriggersService } from '../services/triggers.service';
import { debounce } from 'lodash';
import { GoogleAuthService } from 'src/modules/authentication/services/googleAuth.service';
import { EventsService } from '../services/events.service';
import { WatchService } from '../services/watch.service';
import { Request, Response } from 'express';

@Controller()
export class CalendarController {
  constructor(
    private triggersService: TriggersService,
    private googleAuthService: GoogleAuthService,
    private eventsService: EventsService,
    private watchService: WatchService,
  ) {}

  @Post('/calendar_events')
  calendarEvents(@Req() req: Request, @Res() res: Response) {
    // debounce(
    //   this.triggersService.calendarEventWatchCallback.bind(null, req, res),
    //   1000,
    // );
    this.triggersService.calendarEventWatchCallback(req, res);
  }

  @Get('/integrate')
  watchCalendar(@Req() req: Request, @Res() res: Response) {
    this.googleAuthService.authCheck(req, res).then(async (authClient) => {
      const events = await this.eventsService.listEvents(authClient);
      console.log('Upcoming 10 events:');
      events.map((event, i) => {
        const start = event.start.dateTime || event.start.date;
        console.log(`${start} - ${event.summary}`);
      });

      this.watchService.watchCalendarEvents(authClient);

      res.render('views/pages/slack/integrate.njk');
    });
  }
}
