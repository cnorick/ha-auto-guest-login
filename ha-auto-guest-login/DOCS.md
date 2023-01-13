# Getting Started

After installing the add-on there are just a couple steps you'll have to take.

## Create a Guest Account

[![Open your Home Assistant instance and show your users.](https://my.home-assistant.io/badges/users.svg)](https://my.home-assistant.io/redirect/users/)

1. Go to the Users page in the Home Assistant frontend and click Add User at the bottom right.
2. Fill in Display Name, Username, and Password
    - Be sure to save the password somewhere. You'll need it soon.
3. Make sure the Administrator toggle is off
4. Turn on the "Can only log in from the local network" switch for extra security
5. Click Create

## Create a Guest Dashboard

[![Open your Home Assistant instance and show your dashboard configs.](https://my.home-assistant.io/badges/lovelace_dashboards.svg)](https://my.home-assistant.io/redirect/lovelace_dashboards/)

It's possible to reuse an existing dashboard for guests, or even to create a new tab in an existing dashboard. However, I really like to make things as simple as possible for my guests.
Go to Settings > Dashboards and click the Add Dashboard button to create a new Guest Dashboard.

After creating the dashboard, think about what things you'd like your guests to have access to. My guest dashboard has only the guest bedroom lights/fans, the public space lights, and the thermostat. You don't want to overwhelm guests with too many options.

Before leaving the dashboard, copy down the path of the dashboard. That is, get everything after the first / in your url. For me the full url is 'http://homeassistant.local/lovelace-guest/guest', so I'll copy 'lovelace-guest/guest'.

## Configuration Params

Now, you're ready to add the config params. Click the Configuration tab in the add-on menu.

*guest_username*: the username of the guest user you created earlier
*guest_password*: the password of the guest account. (Don't worry, this information doesn't leave your local network. You can verify in the source code.).
*guest_dashboard_path*: This is the path of your guest dashboard (don't include the leading slash).
*port*: This is the port at which your web server is available.

## Start and Test

Now you're ready to press the start button on the add-on page. After starting, you should see some logs showing up under the logs tab.

To test, do the following (chrome-specific instructions):

1. Open an incognito window (or equivalent)
2. Paste your home assistant address in the url bar. Mine is http://homeassistant.local. Your's may be an ip address or include a port at the end. e.g. http://homeassistant.local:8888 or 192.168.1.55.
3. Before pressing enter, add the port from the configuration tab (default is 8675). So my url becomes http://homeassistant.local:8675
4. Press enter. You should be greeted with a temporary welcome page then redirected to the guest dashboard in home assistant.
5. If that doesn't work, check the logs