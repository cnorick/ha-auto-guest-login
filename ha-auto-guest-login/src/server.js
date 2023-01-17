import express from "express"
import config from '/data/options.json' assert { type: 'json' };
import { AuthClient } from "./auth-client.js";
import { HaClient } from "./ha-client.js";
import { Utils } from "./utils.js";
import QRCode from 'qrcode';

const dashboard = config.guest_dashboard_path;
const guestUserName = config.guest_username;
const guestPassword = config.guest_password;
const welcomeScreenDelay = config.welcome_screen_delay_ms ?? 3000;
const welcomeScreenMainText = config.welcome_screen_main_text ?? 'Thanks for Visiting';
const welcomeScreenSecondaryText = config.welcome_screen_secondary_text ?? 'Redirecting to Home Assistant...';
const supervisorToken = process.env.SUPERVISOR_TOKEN;
const haClient = new HaClient(supervisorToken);
const haPort = await haClient.getHaPort();
const addonPort = await haClient.getAddOnPort();

const authClient = new AuthClient(guestUserName, guestPassword);
const utils = new Utils()
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

app.use('/admin/assets', express.static('assets'));

app.get('/admin', (req, res) => {
  res.render('pages/admin', {
    guestLoginUrl: `${req.protocol}://${req.hostname}`
  });
});

app.get('/admin/qr.svg', async (req, res) => {
  const qrCode = await QRCode.toString(utils.getGuestLoginUrl(req), { type: 'svg' });
  res.set('Content-Type', 'image/svg+xml');
  res.send(qrCode);
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
  console.log(`Auto Guest Login at port ${addonPort}`);
});
