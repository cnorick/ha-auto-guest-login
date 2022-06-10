FROM node:16-alpine
WORKDIR /app
ENV NODE_PATH /app/node_modules
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 80
WORKDIR /config
CMD [ "node", "server.js" ]
