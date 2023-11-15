FROM node:lts-alpine AS build

WORKDIR /app

COPY . .

RUN yarn 

RUN yarn run build

FROM nginx:1.19

WORKDIR /app

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf 