import { Injectable } from '@nestjs/common';

import { calendar_v3, google } from 'googleapis';
import * as moment from 'moment';

@Injectable()
export class EventsService {
  /**
   * Lists the next 10 events on the user's primary calendar.
   * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
   */
  async listEvents(auth) {
    const calendar = google.calendar({
      version: 'v3',
      auth,
      params: {
        key: process.env.GOOGLE_API_KEY,
      },
    });
    const res = await calendar.events.list({
      calendarId: 'primary',
      timeMin: moment().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });
    const events = res.data.items;
    if (!events || events.length === 0) {
      console.log('No upcoming events found.');
      return;
    }

    return events;
  }

  // useful to set status
  async getRunningEvents(auth) {
    const events = await this.listEvents(auth);

    const currentlyRunningEvents = events.filter((event) => {
      const start = this.getEventMoment(event.start);
      const end = this.getEventMoment(event.end);
      return moment().isBetween(start, end);
    });

    return currentlyRunningEvents;
  }

  getEventMoment(date: calendar_v3.Schema$EventDateTime) {
    return moment(date.dateTime || date.date);
  }

  // useful to set leaves
  // getRecentlyUpdatedEvents() {}
}
