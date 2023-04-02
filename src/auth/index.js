class Auth {
  constructor() {
    this.client = null;
  }

  setClient(client) {
    this.client = client;
  }

  getClient() {
    return this.client;
  }
}

const auth = new Auth();

module.exports = {
  auth
}
