import fetch from "/app/node_modules/node-fetch"
import express from "/app/node_modules/express"

const haUrl = "http://homeassistant.local:8123";
const clientId = "http://homeassistant.local:8123/";
const dashboard = "lovelace-test";
const guestUserName = "guest";
const guestPassword = "guest";
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

function createRedirectUri(code) {
  let uri = `${haUrl}/${encodeURIComponent(dashboard)}?auth_callback=1`;
  uri.includes("?") ? uri.endsWith("&") || (uri += "&") : (uri += "?");
  uri += `code=${encodeURIComponent(code)}`;
  uri += `&state=${encodeURIComponent(getState())}`;
  uri += "&storeToken=true";
  return uri
}

async function getRedirectUri() {
  var code = await getCode();
  var uri = createRedirectUri(code);
  return uri;
}


const app = express()

app.get('/', (req, res) => {
  res.sendFile("index.html", { root: '.' });
})
app.get('/api/getRedirectUri', async (req, res) => {
  res.send(await getRedirectUri())
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
