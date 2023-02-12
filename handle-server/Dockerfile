# syntax=docker/dockerfile:1
FROM node:16
WORKDIR /
COPY package*.json ./
RUN npm install
COPY . .
CMD [ "node", "index.js" ]
EXPOSE 3001