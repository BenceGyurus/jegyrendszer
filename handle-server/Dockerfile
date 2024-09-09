# syntax=docker/dockerfile:1
FROM node:22-alpine
WORKDIR /
RUN echo "Europe/Budapest" > /etc/timezone
ENV TZ=Europe/Budapest
ENV NODE_ENV production
COPY package* .
RUN npm install
COPY . .
CMD [ "node", "index.js" ]
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=10 CMD [ "curl -f http://localhost/" ]
EXPOSE 3001