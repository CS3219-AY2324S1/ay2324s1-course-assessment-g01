FROM node:lts-alpine

WORKDIR /app

COPY package.json .

RUN yarn 

COPY . .

## EXPOSE [Port you mentioned in the vite.config file]

EXPOSE 5173

CMD ["yarn", "dev"]