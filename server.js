import fetch from "node-fetch"
import express from "express"
import config from '/data/options.json' assert { type: 'json' };

const dashboard = config.guest_dashboard_path;
const guestUserName = config.guest_username;
const guestPassword = config.guest_password;
const supervisorToken = process.env.SUPERVISOR_TOKEN; 
const haPort = await getHaPort();

async function getHaPort() {
  try {
    const response = await fetch('http://supervisor/core/info', {
      headers: {
        'Authorization': `Bearer ${supervisorToken}`
      }
    });
    if(!response.ok) {
      throw Error('Request to get home assistant port failed', response);
    }
    const body = await response.json();
    return body.data.port;
  }
  catch(e) {
    console.error('unable to get the port that homeassistant is running on', e);
    throw e;
  }
}

function getClientId(haUrl) {
  return haUrl + '/';
}

function getState(haUrl) {
  const state = {
    hassUrl: `${haUrl}`,
    clientId: getClientId(haUrl),
  };
  const jsonState = JSON.stringify(state);
  return Buffer.from(jsonState).toString('base64');
}

async function getFlowId(haUrl) {
  const response = await fetch(`${haUrl}/auth/login_flow`, {
    headers: {
      accept: "*/*",
      "accept-language": "en",
      "content-type": "text/plain;charset=UTF-8",
    },
    body: `{"client_id":"${getClientId(haUrl)}","handler":["homeassistant",null],"redirect_uri":"${haUrl}?auth_callback=1"}`,
    method: "POST",
  });

  if (!response.ok) {
    console.error('unable to get flowId', response.status, response.statusText);
  }

  return (await response.json()).flow_id;
}

async function getCode(haUrl) {
  const flowId = await getFlowId(haUrl);
  console.log('flowId', flowId);
  const response = await fetch(
    `${haUrl}/auth/login_flow/${flowId}`,
    {
      headers: {
        accept: "*/*",
        "accept-language": "en",
        "content-type": "text/plain;charset=UTF-8",
      },
      body: `{"username":"${guestUserName}","password":"${guestPassword}","client_id":"${getClientId(haUrl)}"}`,
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

function createRedirectUri(haUrl, code) {
  console.log('redirecting to', `${haUrl}/${dashboard}`);
  let uri = `${haUrl}/${dashboard}?auth_callback=1`;
  uri.includes("?") ? uri.endsWith("&") || (uri += "&") : (uri += "?");
  uri += `code=${encodeURIComponent(code)}`;
  uri += `&state=${encodeURIComponent(getState(haUrl))}`;
  uri += "&storeToken=true";
  return uri;
}

async function getRedirectUri(haUrl) {
  var code = await getCode(haUrl);
  console.log('code:', code)
  var uri = createRedirectUri(haUrl, code);
  return uri;
}

const app = express();

app.get('/', (req, res) => {
  res.sendFile("index.html", { root: '.' });
})
app.get('/api/getRedirectUri', async (req, res) => {
  const haUrl = `${req.protocol}://${req.hostname}:${haPort}`;
  console.log('recieved request from', `${req.protocol}://${req.hostname}`);
  res.send(await getRedirectUri(haUrl));
})

const port = 80;
app.listen(port, () => {
  console.log(`HomeAssistant is on port ${haPort}`);
})
