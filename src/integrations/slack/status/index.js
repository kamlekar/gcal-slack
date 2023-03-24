const { slack } = require('../service/api');

function setStatus(text, momentEndTime) {
  slack.post('/users.profile.set', {
    profile: {
      status_text: text,
      status_emoji: '',
      status_expiration: momentEndTime.unix()
    }
  }).catch((err) => console.log(err))
};

function clearStatus() {
  slack.post('/users.profile.set', {
    profile: {
      status_text: '',
      status_emoji: '',
    }
  }).catch((err) => console.log(err))
}

module.exports = {
  setStatus,
  clearStatus
}
