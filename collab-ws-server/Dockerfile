FROM node:lts-alpine

WORKDIR /app

COPY . .

RUN yarn 

EXPOSE 4444

ENV PORT=4444
ENV HOST="0.0.0.0"

CMD ["npx", "y-websocket"]