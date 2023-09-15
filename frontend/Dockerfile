FROM node:lts-alpine

WORKDIR /app

COPY . .

RUN yarn 

## EXPOSE [Port you mentioned in the vite.config file]

EXPOSE 5173

CMD ["yarn", "dev"]