FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 80
RUN npm run build
CMD [ "node", "server.js" ]
