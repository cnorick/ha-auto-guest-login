import express from "express"
import config from '/data/options.json' assert { type: 'json' };
import { AuthClient } from "./auth-client.js";
import { HaClient } from "./ha-client.js";

const dashboard = config.guest_dashboard_path;
const guestUserName = config.guest_username;
const guestPassword = config.guest_password;
const supervisorToken = process.env.SUPERVISOR_TOKEN; 
const haClient = new HaClient(supervisorToken);
const haPort = await haClient.getHaPort();

const authClient = new AuthClient(guestUserName, guestPassword);

const app = express();

app.get('/', (req, res) => {
  res.sendFile("index.html", { root: '.' });
})
app.get('/api/getRedirectUri', async (req, res) => {
  const haUrl = `${req.protocol}://${req.hostname}:${haPort}`;
  console.log('recieved request from', `${req.protocol}://${req.hostname}`);
  console.log('redirecting to', `${haUrl}/${dashboard}`);

  res.send(await authClient.getRedirectUri(haUrl, dashboard));
})

const port = 80;
app.listen(port, () => {
  console.log(`HomeAssistant is on port ${haPort}`);
})
