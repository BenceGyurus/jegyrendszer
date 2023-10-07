FROM node:10.1.0-alpine AS builder
ENV NODE_ENV production
WORKDIR /app
COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.19-alpine AS server
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
# COPY ./etc/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build .
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]