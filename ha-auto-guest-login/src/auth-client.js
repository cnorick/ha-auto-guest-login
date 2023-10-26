import fetch from "node-fetch"

export class AuthClient {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }

  async getRedirectUri(internalUrl, redirectBaseUrl, dashboard) {
    const clientId = this.#getClientId(redirectBaseUrl);
    console.log(`using clientId: ${clientId}`);

    const code = await this.#getCode(internalUrl, redirectBaseUrl, clientId);
    console.log(`code: ${code}`);

    const uri = this.#createRedirectUri(redirectBaseUrl, code, clientId, dashboard);
    return uri;
  }

  async #getCode(internalUrl, redirectBaseUrl, clientId) {
    const flowId = await this.#getFlowId(internalUrl, redirectBaseUrl, clientId);
    console.log(`flowId: ${flowId}`);

    const url = `${internalUrl}/auth/login_flow/${flowId}`;
    console.log('fetching code');
    console.log(`\turl: ${url}`);

    const response = await fetch(
      url,
      {
        headers: {
          accept: "*/*",
          "accept-language": "en",
          "content-type": "text/plain;charset=UTF-8",
        },
        body: `{"username":"${this.username}","password":"${this.password}","client_id":"${clientId}"}`,
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

  async #getFlowId(baseAuthUrl, baseRedirectUrl, clientId) {
    const url = `${baseAuthUrl}/auth/login_flow`;
    const redirectUri = `${baseRedirectUrl}?auth_callback=1`;
    console.log(`fetching flowId`);
    console.log(`\turl: ${url}`);
    console.log(`\tredirectUri: ${redirectUri}`);

    const response = await fetch(url, {
      headers: {
        accept: "*/*",
        "accept-language": "en",
        "content-type": "text/plain;charset=UTF-8",
      },
      body: `{"client_id":"${clientId}","handler":["homeassistant",null],"redirect_uri":"${redirectUri}"}`,
      method: "POST",
    });

    if (!response.ok) {
      console.error('unable to get flowId', response.status, response.statusText);
    }

    return (await response.json()).flow_id;
  }

  #getState(haUrl, clientId) {
    const state = {
      hassUrl: `${haUrl}`,
      clientId,
    };
    const jsonState = JSON.stringify(state);
    return Buffer.from(jsonState).toString('base64');
  }

  #createRedirectUri(haUrl, code, clientId, dashboard) {
    let uri = `${haUrl}/${dashboard}?auth_callback=1`;
    uri.includes("?") ? uri.endsWith("&") || (uri += "&") : (uri += "?");
    uri += `code=${encodeURIComponent(code)}`;
    uri += `&state=${encodeURIComponent(this.#getState(haUrl, clientId))}`;
    uri += "&storeToken=true";
    return uri;
  }
}