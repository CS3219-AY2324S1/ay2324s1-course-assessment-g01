# Prerequisites

Before you begin, ensure you have installed:

- Node Package Manager
- Go
- Docker

## Instructions to initialize PostgreSQL database

1. Open Docker.
2. Run docker compose command from the root directory. After the container is up, the database will be listening on [http://localhost:5000](http://localhost:5000)

```bash
docker compose up -d
```

- Below contains the connection details. (Configs can be set in `docker-compose.yaml`)

```env
server: localhost
database name: dev
port: 5000
username: postgres
password: 123
```

## Instructions to initialize user-service

1. Run below command from the same directory in a terminal to start the user-service service.

```bash
go run main.go
```
