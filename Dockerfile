FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . /config
WORKDIR /config
EXPOSE 80
CMD [ "node", "server.js" ]
