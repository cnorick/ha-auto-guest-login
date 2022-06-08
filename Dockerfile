FROM node:16-alpine
WORKDIR /config
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 80
CMD [ "node", "server.js" ]
