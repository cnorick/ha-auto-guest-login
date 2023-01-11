ARG BUILD_FROM
FROM $BUILD_FROM
WORKDIR /app
RUN apk add nodejs npm
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 80
CMD [ "node", "server.js" ]
