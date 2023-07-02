# syntax=docker/dockerfile:1
FROM node:16-alpine
WORKDIR /
COPY package* .
RUN npm install
COPY . .
CMD [ "node", "index.js" ]
EXPOSE 3001