const { authorize } = require('../auth/google');

function authCheck(req, res) {
  return new Promise((resolve, reject) => {
    authorize(req, function (authClient) {
      resolve(authClient);
    });
  });
}

module.exports = {
  authCheck
}
