# syntax=docker/dockerfile:1
FROM node:16
WORKDIR /
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
CMD [ "npm", "start" ]
EXPOSE 3000