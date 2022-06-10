FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 80
CMD [ "node", "server.js" ]
