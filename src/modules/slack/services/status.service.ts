import { Injectable } from '@nestjs/common';

import axios from 'axios';

@Injectable()
export class StatusService {
  getSlack() {
    const slack = axios.create({
      baseURL: process.env.SLACK_API_URL,
      timeout: 1000,
      headers: {
        Authorization: `Bearer ${process.env.SLACK_USER_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    return slack;
  }

  setStatus(text, momentEndTime) {
    this.getSlack()
      .post('/users.profile.set', {
        profile: {
          status_text: text,
          status_emoji: '',
          status_expiration: momentEndTime.unix(),
        },
      })
      .catch((err) => console.log(err));
  }

  clearStatus() {
    this.getSlack()
      .post('/users.profile.set', {
        profile: {
          status_text: '',
          status_emoji: '',
        },
      })
      .catch((err) => console.log(err));
  }
}
