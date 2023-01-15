import express from "express"
import config from '/data/options.json' assert { type: 'json' };
import { AuthClient } from "./auth-client.js";
import { HaClient } from "./ha-client.js";

const dashboard = config.guest_dashboard_path;
const guestUserName = config.guest_username;
const guestPassword = config.guest_password;
const welcomeScreenDelay = config.welcome_screen_delay_ms ?? 3000;
const welcomeScreenMainText = config.welcome_screen_main_text ?? 'Thanks for Visiting';
const welcomeScreenSecondaryText = config.welcome_screen_secondary_text ?? 'Redirecting to Home Assistant...';
const supervisorToken = process.env.SUPERVISOR_TOKEN; 
const haClient = new HaClient(supervisorToken);
const haPort = await haClient.getHaPort();

const authClient = new AuthClient(guestUserName, guestPassword);

const app = express();
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
  await haClient.postLoginEvent(req);
  res.render("pages/guest-welcome", { 
    delay: welcomeScreenDelay,
    mainText: welcomeScreenMainText,
    secondaryText: welcomeScreenSecondaryText
  });
});

app.get('/api/getRedirectUri', async (req, res) => {
  const haUrl = `${req.protocol}://${req.hostname}:${haPort}`;
  console.log('recieved request from', `${req.protocol}://${req.hostname}`);
  console.log('redirecting to', `${haUrl}/${dashboard}`);

  res.send(await authClient.getRedirectUri(haUrl, dashboard));
});

const internalPort = 80;
app.listen(internalPort, () => {
  console.log(`HomeAssistant found on port ${haPort}`);
});
