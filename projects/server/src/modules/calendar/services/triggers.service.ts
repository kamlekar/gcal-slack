import { Injectable } from '@nestjs/common';
import { EventsService } from './events.service';
import { GoogleAuthService } from '../../authentication/services/googleAuth.service';
import { StatusService } from '../../slack/services/status.service';

@Injectable()
export class TriggersService {
  constructor(
    private googleAuthService: GoogleAuthService,
    private eventsService: EventsService,
    private slackStatusService: StatusService,
  ) {}

  calendarEventWatchCallback(req, res) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const _this = this;
      const subscription = req.body;

      this.googleAuthService.authorize(req, async function (auth) {
        const events = await _this.eventsService.getRunningEvents(auth);
        events.forEach((event) => {
          console.log('current event:', event.summary);
          _this.slackStatusService.setStatus(
            event.summary,
            _this.eventsService.getEventMoment(event.end),
          );
        });

        if (events.length === 0) {
          _this.slackStatusService.clearStatus();
        }
      });
      console.log('subscription: ', JSON.stringify(subscription));
    } catch (ex) {
      console.log('error: ', ex);
    }
  }
}
