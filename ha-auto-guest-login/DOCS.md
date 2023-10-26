# Using Guest Auto Login

## Getting Started

After installing the add-on there are just a couple steps you'll have to take.

### Create a Guest Account

[![Open your Home Assistant instance and show your users.](https://my.home-assistant.io/badges/users.svg)](https://my.home-assistant.io/redirect/users/)

1. Go to the Users page in the Home Assistant frontend and click Add User at the bottom right.
2. Fill in Display Name, Username, and Password
    - Be sure to save the password somewhere. You'll need it soon.
3. Make sure the Administrator toggle is off
4. Turn on the "Can only log in from the local network" switch for extra security
5. Click Create

### Create a Guest Dashboard

[![Open your Home Assistant instance and show your dashboard configs.](https://my.home-assistant.io/badges/lovelace_dashboards.svg)](https://my.home-assistant.io/redirect/lovelace_dashboards/)

It's possible to reuse an existing dashboard for guests, or even to create a new tab in an existing dashboard. However, I really like to make things as simple as possible for my guests.
Go to Settings > Dashboards and click the Add Dashboard button to create a new Guest Dashboard.

After creating the dashboard, think about what things you'd like your guests to have access to. My guest dashboard has only the guest bedroom lights/fans, the public space lights, and the thermostat. You don't want to overwhelm guests with too many options.

Before leaving the dashboard, copy down the path of the dashboard. That is, get everything after the first / in your url. For me the full url is 'http://homeassistant.local/lovelace-guest/guest', so I'll copy 'lovelace-guest/guest'.

### Configuration Params

Now, you're ready to add the config params. Click the Configuration tab in the add-on menu.

| Configuration Param | Required | Default Value | Description |
| ------------------- | -------- | ------------- | ----------- |
| guest_username      | Yes      | null          | the username of the guest user you created earlier |
| guest_password      | Yes      | null          | the password of the guest account. (Don't worry, this information doesn't leave your local network. You can verify in the source code.).
| guest_dashboard_path | Yes     | lovelace/default_view | the path of your guest dashboard (don't include the leading slash; for example, my full url is 'http://homeassistant.local/lovelace-guest/guest', so I'll copy 'lovelace-guest/guest').
| welcome_screen_delay_ms | No   | 3000          | amount of time in milliseconds to delay on the welcome screen before redirecting to Home Assistant. This gives guests time to read the welcome screen.
| welcome_screen_main_text | No  | 'Thanks for Visiting' | the large text that appears on the welcome screen
| welcome_screen_secondary_text  | No | 'Redirecting to Home Assistant...' | the text that appears below the main text on the welcome screen
| advanced_internal_base_ha_url_and_port  | No | '' | Advanced option. Don't use unless you know what you're doing. For complex setups where guests may be using a url that is not the same as your internal HA url. This is the url that the service will use to make auth requests for the guest user. This should be a HA url/ip that can be accessed by the machine running this service. By default, this url is built automatically using 1. the url your guest hits, and 2. the port homeassistant is running on. For example, if your guest hits the url `http://homeassistant.local:8675` and your home assistant instance is on port 8123, then this will default to `http://homeassistant.local:8123`. If specified, this should be a full url including protocol and port (unless it's 80 or 443). e.g. `http://192.168.1.99:8123`, or `https://homeassistant.local`, or `http://homeassistant.local:42`.
| advanced_redirect_base_ha_url_and_port  | No | '' | Advanced option. Don't use unless you know what you're doing. For complex setups where guests may be using a url that is not the same as your internal HA url. This is the base url that your users should be redirected to. This will also function as the clientId when making auth requests. Use this if you need to redirect your users to a url that is not the same as the one they are hitting for this service. By default, this url is built automatically using 1. the url your guest hits, and 2. the port homeassistant is running on. For example, if your guest hits the url `http://homeassistant.local:8675` and your home assistant instance is on port 8123, then this will default to `http://homeassistant.local:8123`. This should be a full url and port as described above.
| network port 80/tcp | Yes       | 8675          | the port at which your web server is available

### Start and Test

Now you're ready to press the start button on the add-on page. After starting, you should see some logs showing up under the logs tab.

To test, do the following (chrome-specific instructions):

1. On the Info tab, press the Open Web UI button
    - This will open the Admin page
2. On the admin page, you should see a url and a QR code
3. Click the url or scan the QR code
4. If everything works correctly, you should see the welcome page, then be redirected to your guest dashboard logged in as a guest

#### Manual Testing

1. Open an incognito window (or equivalent)
2. Paste your home assistant address in the url bar. Mine is http://homeassistant.local. Your's may be an ip address or include a port at the end. e.g. http://homeassistant.local:8888 or 192.168.1.55.
3. Before pressing enter, add the port from the configuration tab (default is 8675). So my url becomes http://homeassistant.local:8675
4. Press enter. You should be greeted with a temporary welcome page then redirected to the guest dashboard in home assistant.
5. If that doesn't work, check the logs

## Running Automations when Guests Log In

Creating automations based on this add-on is really easy. When guests log in, the add-on emits a `ha_auto_login_guest_logged_in' event with some guest user data.
You can just create an automation that triggers based on that event.

*Note*: This event fires when the guest first visits the login page, before `welcome_screen_delay_ms` starts, and before they're redirected to Home Assistant. 

Event Data:

| Property | Description |
| -------- | ----------- |
| ip       | the ip address of the device that requested the guest-auto-login page. |

Sample event:
```
event_type: ha_auto_login_guest_logged_in
data:
  ip: "::ffff:192.168.1.99"
origin: REMOTE
time_fired: "2023-01-15T22:01:27.751775+00:00"
context:
  id: xxxxxxx
  parent_id: null
  user_id: xxxxx
```


Sample Automation:
``` yaml
description: "Send notification with the ip address of the user that logged in"
mode: single
trigger:
  - platform: event
    event_type: ha_auto_login_guest_logged_in
condition: []
action:
  - service: notify.notify
    data:
      message: "Guest at ip address {{trigger.event.data.ip}} just logged in to Home Assistant"
```