FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
WORKDIR /config
COPY /app /config
EXPOSE 80
CMD [ "node", "server.js" ]
