# syntax=docker/dockerfile:1
FROM node:16-alpine
WORKDIR /
RUN apt install tzdata -y
RUN echo "Europe/Budapest" > /etc/timezone
ENV TZ=Europe/Budapest
COPY package* .
RUN npm install
COPY . .
CMD [ "node", "index.js" ]
EXPOSE 3001