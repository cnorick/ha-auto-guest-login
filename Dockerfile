FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . /config
EXPOSE 80
WORKDIR /config
CMD [ "node", "server.js" ]
