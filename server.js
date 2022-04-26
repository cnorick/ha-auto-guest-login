import fetch from "node-fetch"
import express from "express"

const haUrl = "http://homeassistant.local";
const clientId = "http://homeassistant.local/";
const defaultDashboard = "lovelace-guest";
const guestUserName = "guest";
const guestPassword = "password";
const port = 80;

function getState() {
  const state = {
    hassUrl: `${haUrl}`,
    clientId: clientId,
  };
  const jsonState = JSON.stringify(state);
  return Buffer.from(jsonState).toString('base64');
}

async function getFlowId() {
  const response = await fetch(`${haUrl}/auth/login_flow`, {
    headers: {
      accept: "*/*",
      "accept-language": "en",
      "content-type": "text/plain;charset=UTF-8",
    },
    body: `{"client_id":"${clientId}","handler":["homeassistant",null],"redirect_uri":"${haUrl}?auth_callback=1"}`,
    method: "POST",
  });

  return (await response.json()).flow_id;
}

async function getCode() {
  const flowId = await getFlowId();
  const response = await fetch(
    `${haUrl}/auth/login_flow/${flowId}`,
    {
      headers: {
        accept: "*/*",
        "accept-language": "en",
        "content-type": "text/plain;charset=UTF-8",
      },
      body: `{"username":"${guestUserName}","password":"${guestPassword}","client_id":"${clientId}"}`,
      method: "POST",
    }
  );
  return (await response.json()).result;
}

function createRedirectUri(code, dashboard) {
  let uri = `${haUrl}/${(dashboard)}?auth_callback=1`;
  uri.includes("?") ? uri.endsWith("&") || (uri += "&") : (uri += "?");
  uri += `code=${encodeURIComponent(code)}`;
  uri += `&state=${encodeURIComponent(getState())}`;
  uri += "&storeToken=true";
  return uri
}

async function getRedirectUri(userProvidedDashboard) {
  var code = await getCode();
  var uri = createRedirectUri(code, userProvidedDashboard || defaultDashboard);
  return uri;
}


const app = express()

app.get('/', (req, res) => {
  res.sendFile("index.html", { root: '.' });
})
app.get('/api/getRedirectUri', async (req, res) => {
  res.send(await getRedirectUri(req.query.dashboard))
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
