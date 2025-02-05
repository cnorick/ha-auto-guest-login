import fs from 'node:fs';
import express from "express"
import { AuthClient } from "./auth-client.js";
import { HaClient } from "./ha-client.js";
import { Utils } from "./utils.js";
import QRCode from 'qrcode';

const configPath = '/data/options.json';
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const dashboard = config.guest_dashboard_path;
const guestUserName = config.guest_username;
const guestPassword = config.guest_password;
const welcomeScreenDelay = config.welcome_screen_delay_ms ?? 3000;
const welcomeScreenMainText = config.welcome_screen_main_text ?? 'Thanks for Visiting';
const welcomeScreenSecondaryText = config.welcome_screen_secondary_text ?? 'Redirecting to Home Assistant...';
const internalHaUrlFromConfig = config.advanced_internal_base_ha_url_and_port || null; // empty string by default.
const redirectBaseUrlFromConfig = config.advanced_redirect_base_ha_url_and_port || null; // empty string by default.
const supervisorToken = process.env.SUPERVISOR_TOKEN;
const haClient = new HaClient(supervisorToken);
const haPort = await haClient.getHaPort();
const addonPort = await haClient.getAddOnPort();

const authClient = new AuthClient(guestUserName, guestPassword);
const utils = new Utils(addonPort);
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
    guestLoginUrl: `${utils.getGuestLoginUrl(req)}`
  });
});

app.get('/admin/qr.svg', async (req, res) => {
  const qrCode = await QRCode.toString(utils.getGuestLoginUrl(req), { type: 'svg' });
  res.set('Content-Type', 'image/svg+xml');
  res.send(qrCode);
});

app.get('/api/getRedirectUri', async (req, res) => {
  const portString = [443, 80].includes(haPort) ? '' : `:${haPort}`;
  const haUrl = `${req.protocol}://${req.hostname}${portString}`;
  const internalUrl = internalHaUrlFromConfig ?? haUrl;
  const redirectBaseUrl = redirectBaseUrlFromConfig ?? haUrl;
  console.log('recieved request from:', `${req.protocol}://${req.hostname}`);
  console.log('using internal url:', internalUrl);
  console.log('using redirect baseUrl:', redirectBaseUrl);

  const redirectUri = await authClient.getRedirectUri(internalUrl, redirectBaseUrl, dashboard)
  console.log('sending redirect uri to client');
  console.log(`\tredirectUri: ${redirectUri}`);
  console.log('\n--------\n');
  res.send(redirectUri);
});

const internalPort = 80;
app.listen(internalPort, () => {
  console.log(`HomeAssistant found on port ${haPort}`);
  console.log(`Auto Guest Login at port ${addonPort}`);
});
