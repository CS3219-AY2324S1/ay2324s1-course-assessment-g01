# Prerequisites

Before you begin, ensure you have installed:

- Go
- Docker

## Instructions to initialize PostgreSQL database and collaboration-service

1. Open Docker.
2. Run docker compose command from the root directory. After the container is up, the database will be listening on [http://localhost:5001](http://localhost:5001)
3. After the container is up, the collaboration service will be listening on [http://localhost:3005](http://localhost:3005)

```bash
docker compose up -d
```

## Using the collaboration service

### Get Room By Id

**Get <http://localhost:3005/api/v1/room?id=1>**

## Create Room

**Post <http://localhost:3005/api/v1/room/create>**

```json
{
 "user_a_id": 1,
 "user_b_id": 2,
}
```

## Delete Room By Id

**Post <http://localhost:3005/api/v1/room/delete>**

```json
{
 "id": 1,
}
```

## Environment variables

- The connection details are as follows - these configs can be set in `docker-compose.yaml`

```env
RABBITMQ_USER=guest
RABBITMQ_PASS=guest
RABBITMQ_HOST=rabbitmq
RABBITMQ_PORT=15672 // (5672 for development)
```
