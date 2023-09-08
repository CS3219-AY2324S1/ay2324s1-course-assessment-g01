FROM golang:1.19.0-alpine3.16 AS builder

RUN mkdir /app

ADD . /app

WORKDIR /app

RUN go build -o main . 

CMD ["/app/main"]
