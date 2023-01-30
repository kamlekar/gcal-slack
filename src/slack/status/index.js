const { slack } = require('../service/api');

function setStatus(text, momentEndTime) {
  slack.post('/users.profile.set', {
    profile: {
      status_text: text,
      status_emoji: '',
      status_expiration: momentEndTime.unix()
    }
  })
};

function clearStatus() {
  slack.post('/users.profile.set', {
    profile: {
      status_text: '',
      status_emoji: '',
    }
  })
}

module.exports = {
  setStatus,
  clearStatus
}
