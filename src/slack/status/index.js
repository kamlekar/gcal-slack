const { slack } = require('../service/api');

function setStatus(text) {
  slack.post('/users.profile.set', {
    profile: {
      status_text: text
    }
  })
};

module.exports = {
  setStatus
}
