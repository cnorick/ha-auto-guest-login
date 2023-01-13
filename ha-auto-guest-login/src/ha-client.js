import fetch from "node-fetch"

export class HaClient {
  constructor(supervisorToken) {
    this.supervisorToken = supervisorToken;
  }

  async getHaPort() {
    try {
      const response = await fetch('http://supervisor/core/info', {
        headers: {
          'Authorization': `Bearer ${this.supervisorToken}`
        }
      });
      if (!response.ok) {
        throw Error('Request to get home assistant port failed', response);
      }
      const body = await response.json();
      return body.data.port;
    }
    catch (e) {
      console.error('unable to get the port that homeassistant is running on', e);
      throw e;
    }
  }
}