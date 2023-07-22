FROM node:18-alpine
WORKDIR /
COPY package* .
RUN npm install
COPY . .
CMD [ "node", "main.js" ]