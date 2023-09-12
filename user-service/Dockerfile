FROM golang:1.19.0-alpine3.16 AS builder

RUN mkdir /app

ADD . /app

WORKDIR /app

RUN go build -o main .

RUN mkdir /build

RUN mv main build

CMD ["/app/build/main"]
