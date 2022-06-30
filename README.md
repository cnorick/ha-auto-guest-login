# ha-auto-guest-login

A server logs guests into Home Assistant automatically.
For more info, see <https://nathanorick.com/ha-automatic-guest-login>.

## Container Installation

Here are some example snippets to help you get started creating a container.

### docker-compose

You can copy the following into a `docker-compose.yml` file locally, change the environment variables to match your setup, then run `docker-compose up` to start the service.

```yaml
---
version: "3"
services:
  ha-auto-guest-login:
    image: norick/ha-auto-guest-login:main
    container_name: ha-auto-guest-login
    environment:
      - CLIENTID=http://homeassistant.local/
      - URL=http://homeassistant.local
      - DASH=lovelace-guest
      - USER=username
      - PASS=password
    ports:
      - 80:80
    restart: unless-stopped
```

### docker cli ([click here for more info](https://docs.docker.com/engine/reference/commandline/cli/))

```bash
docker run -d \
  --name=ha-auto-guest-login \
  -e CLIENTID=http://homeassistant.local/ \
  -e URL=http://homeassistant.local \
  -e DASH=lovelace-guest \
  -e USER=username \
  -e PASS=password \
  -p 80:80 \
  --restart unless-stopped \
  norick/ha-auto-guest-login:main
```

## Parameters

Container images are configured using parameters passed at runtime (such as those above). These parameters are separated by a colon and indicate `<external>:<internal>` respectively. For example, `-p 8080:80` would expose port `80` from inside the container to be accessible from the host's IP on port `8080` outside the container.

| Parameter | Function |
| :----: | --- |
| `-p 80` | WebUI |
| `-e CLIENTID=http://homeassistant.local/` | Usually matches URL. See [Getting ClientId](#getting-clientid) for instructions on finding it |
| `-e URL=http://homeassistant.local` | URL of Home Assistant instance |
| `-e DASH=lovelace-guest` | Home Assistant Dashboard to automatically be directed to. In this example setup: <http://homeassistant.local/guest-dashboard> |
| `-e USER=username` | Home Assistant user that is automatically logged into |
| `-e PASS=password` | Password of Home Assistant user above |


### Getting ClientId
1. Log out of Home Assistant
1. In Chrome, press F12 to open dev tools, then navigate to the Network Tab
1. Check the "Preserve Log" option
  ![image](https://user-images.githubusercontent.com/11449043/176753310-7d9bb1d2-a7c7-4f4b-89d4-d5d8043be4b2.png)
1. Navigate to your Home Assistant Url
1. Log in (you can use incorrect credentials so you don't get redirected)
1. Look in the Network tab for a fetch request made to a random string of characters
  ![image](https://user-images.githubusercontent.com/11449043/176753919-04ac4e9b-1b1b-411c-8a43-98d93923d0a4.png)
1. Click that request and check that it was made to /auth/login_flow
  ![image](https://user-images.githubusercontent.com/11449043/176754069-c307e08b-8972-4e31-8072-d601fa082fbd.png)
1. Open the "Payload" tab and find the clientId


