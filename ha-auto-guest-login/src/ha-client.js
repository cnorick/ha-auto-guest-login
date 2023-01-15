import fetch from "node-fetch"

export class HaClient {
  #supervisorBase = 'http://supervisor/core';
  #apiBase = this.#supervisorBase + '/api';
  constructor(supervisorToken) {
    this.supervisorToken = supervisorToken;
  }

  async getHaPort() {
    try {
      const response = await this.#fetch(`${this.#supervisorBase}/info`);
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

  async postLoginEvent(req) {
    const event = 'ha_auto_login_guest_logged_in';
    const body = { ip: req?.ip };
    const response = await this.#postToApi(`/events/${event}`, body);
    if (!response.ok) {
      console.error('failed to post login event');
    }
    console.log(`posted ${event} event`);
  }

  async #getFromApi(route) {
    return this.#fetch(`${this.#apiBase}${route}`);
  }

  async #postToApi(route, body) {
    return this.#fetch(`${this.#apiBase}${route}`, body, 'POST');
  }

  async #fetch(url, body, method = 'GET', headers = {}) {
    if (typeof body == "object") {
      body = JSON.stringify(body);
      if (!headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
      }
    }

    return await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.supervisorToken}`,
        ...headers
      },
      body,
      method
    });
  }
}