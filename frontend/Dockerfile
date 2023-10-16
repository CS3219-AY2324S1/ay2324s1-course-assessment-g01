FROM node:lts-alpine AS build

WORKDIR /app

COPY . .

RUN yarn 

RUN yarn run build

EXPOSE 5173

FROM nginx:1.19

WORKDIR /app

COPY --from=build /app/dist /usr/share/nginx/html

