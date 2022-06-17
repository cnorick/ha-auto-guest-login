# ha-auto-guest-login
A server logs guests into Home Assistant automatically.
For more info, see https://nathanorick.com/ha-automatic-guest-login.

## Container Installation

Here are some example snippets to help you get started creating a container.

### docker-compose 

```yaml
---
version: "3"
services:
  ha-auto-guest-login:
    image: cnorick/ha-auto-guest-login:main
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
  cnorick/ha-auto-guest-login:main
```

## Parameters

Container images are configured using parameters passed at runtime (such as those above). These parameters are separated by a colon and indicate `<external>:<internal>` respectively. For example, `-p 8080:80` would expose port `80` from inside the container to be accessible from the host's IP on port `8080` outside the container.

| Parameter | Function |
| :----: | --- |
| `-p 80` | WebUI |
| `-e CLIENTID=http://homeassistant.local/` | not sure |
| `-e URL=http://homeassistant.local` | URL of Home Assistant instance |
| `-e DASH=lovelace-guest` | Home Assistant Dashboard to automatically be directed to. In this example setup: http://homeassistant.local/guest-dashboard |
| `-e USER=username` | Home Assistant user that is automatically logged into |
| `-e PASS=password` | Password of Home Assistant user above |
