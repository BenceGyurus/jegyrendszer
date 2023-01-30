# syntax=docker/dockerfile:1
FROM node:8.11.0
WORKDIR /
COPY . .
RUN npm install express
RUN npm install mongodb
CMD [ "node", "index.js" ]
EXPOSE 3000