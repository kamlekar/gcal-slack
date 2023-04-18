const axios = require('axios');

const slack = axios.create({
  baseURL: process.env.SLACK_API_URL,
  timeout: 1000,
  headers: {
    'Authorization': `Bearer ${process.env.SLACK_USER_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

module.exports = {
  slack
}

