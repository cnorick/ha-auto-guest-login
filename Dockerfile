FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
ENV CONFIG_DIR=/config
ENV DOCKER_ENV=true
COPY server.js server.js
COPY index.html index.html
COPY . .
RUN npm run build
RUN npm link
EXPOSE 80
CMD [ "node", "server.js" ]
