import { google } from 'googleapis';
import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WatchService {
  channelId;
  channelResourceId;

  // Responsible to initiate trigger if any event is created/updated/deleted
  // In Google calendar irrespective of event date
  async watchCalendarEvents(auth) {
    const calendar = google.calendar({
      version: 'v3',
      params: {
        key: process.env.GOOGLE_API_KEY,
      },
      auth,
    });
    const channel = {
      id: uuidv4(),
      type: 'web_hook',
      // @NOTE: use ngrok url to test instead of env HOST
      address: `${process.env.HOST}/calendar_events`, // triggers callback
    };

    try {
      const response = await calendar.events.watch({
        calendarId: 'primary',
        requestBody: channel,
      });
      console.log(response);

      this.channelId = response.data.id;
      this.channelResourceId = response.data.resourceId;
    } catch {
      console.log('something went wrong');
    }
  }

  stopWatchingCalendarEvents(auth) {
    const calendar = google.calendar({
      version: 'v3',
      params: {
        key: process.env.GOOGLE_API_KEY,
      },
      auth,
    });

    calendar.channels.stop({
      requestBody: {
        id: this.channelId,
        resourceId: this.channelResourceId,
      },
    });
  }
}
