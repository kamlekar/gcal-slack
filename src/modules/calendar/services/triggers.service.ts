import { Injectable } from '@nestjs/common';
import { EventsService } from './events.service';
import { GoogleAuthService } from 'src/modules/authentication/services/googleAuth.service';
import { StatusService } from 'src/modules/slack/services/status.service';

@Injectable()
export class TriggersService {
  constructor(
    private slackStatusService: StatusService,
    private eventsService: EventsService,
    private googleAuthService: GoogleAuthService,
  ) {}

  calendarEventWatchCallback(req, res) {
    try {
      const subscription = req.body;

      this.googleAuthService.authorize(req, async function (auth) {
        const events = await this.eventsService.getRunningEvents(auth);
        events.forEach((event) => {
          console.log('current event:', event.summary);
          this.slackStatusService.setStatus(
            event.summary,
            this.eventsService.getEventMoment(event.end),
          );
        });

        if (events.length === 0) {
          this.slackStatusService.clearStatus();
        }
      });
      console.log('subscription: ', JSON.stringify(subscription));
    } catch (ex) {
      console.log('error: ', ex);
    }
  }
}
