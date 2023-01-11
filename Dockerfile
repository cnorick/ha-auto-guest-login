ARG BUILD_FROM
FROM $BUILD_FROM
WORKDIR /app
RUN curl -fsSL https://deb.nodesource.com/setup_19.x | sudo -E bash - &&\
    sudo apt-get install -y nodejs
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 80
CMD [ "node", "server.js" ]
