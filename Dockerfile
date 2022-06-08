FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
WORKDIR /config
CMD [ "node", "server.js" ]
