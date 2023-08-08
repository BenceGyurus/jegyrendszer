# syntax=docker/dockerfile:1
FROM node:16
WORKDIR /
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
CMD [ "node", "server.js" ]
EXPOSE 3000