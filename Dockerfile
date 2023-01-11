ARG BUILD_FROM
FROM $BUILD_FROM
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 80
CMD [ "node", "server.js" ]
