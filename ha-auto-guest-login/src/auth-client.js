import fetch from "node-fetch"

export class AuthClient {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }

  async getRedirectUri(haUrl, dashboard) {
    var code = await this.#getCode(haUrl);
    var uri = this.#createRedirectUri(haUrl, code, dashboard);
    return uri;
  }

  async #getCode(haUrl) {
    const flowId = await this.#getFlowId(haUrl);
    const response = await fetch(
      `${haUrl}/auth/login_flow/${flowId}`,
      {
        headers: {
          accept: "*/*",
          "accept-language": "en",
          "content-type": "text/plain;charset=UTF-8",
        },
        body: `{"username":"${this.username}","password":"${this.password}","client_id":"${this.#getClientId(haUrl)}"}`,
        method: "POST",
      }
    );

    if (!response.ok) {
      console.error('unable to get code', response.status, response.statusText);
    }

    const body = await response.json();
    if (body.errors) {
      console.error(body.errors);
      console.error('the username and password are likely incorrect');
    }

    return body.result;
  }


  #getClientId(baseUrl) {
    return baseUrl + '/';
  }

  async #getFlowId(baseUrl) {
    const response = await fetch(`${baseUrl}/auth/login_flow`, {
      headers: {
        accept: "*/*",
        "accept-language": "en",
        "content-type": "text/plain;charset=UTF-8",
      },
      body: `{"client_id":"${this.#getClientId(baseUrl)}","handler":["homeassistant",null],"redirect_uri":"${baseUrl}?auth_callback=1"}`,
      method: "POST",
    });

    if (!response.ok) {
      console.error('unable to get flowId', response.status, response.statusText);
    }

    return (await response.json()).flow_id;
  }

  #getState(haUrl) {
    const state = {
      hassUrl: `${haUrl}`,
      clientId: this.#getClientId(haUrl),
    };
    const jsonState = JSON.stringify(state);
    return Buffer.from(jsonState).toString('base64');
  }

  #createRedirectUri(haUrl, code, dashboard) {
    let uri = `${haUrl}/${dashboard}?auth_callback=1`;
    uri.includes("?") ? uri.endsWith("&") || (uri += "&") : (uri += "?");
    uri += `code=${encodeURIComponent(code)}`;
    uri += `&state=${encodeURIComponent(this.#getState(haUrl))}`;
    uri += "&storeToken=true";
    return uri;
  }
}