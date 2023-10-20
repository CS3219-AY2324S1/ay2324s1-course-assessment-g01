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

Response:

```json
{
    "room_id": 1, // uint
    "question_id": "df2374892143", // string
    "user_a_id": 1, // uint
    "user_b_id": 2, // uint
    "is_open": true // bool
}
```

### Create Room

**Post <http://localhost:3005/api/v1/room/create>**

Request:

```json
{
    "user_a_id": 1, // uint
    "user_b_id": 2, // uint
    "question_id": "df2374892143", // string
}
```

Response:

```json
{
    "room_id": 1, // uint
    "question_id": "df2374892143", // string
    "user_a_id": 1, // uint
    "user_b_id": 2, // uint
    "is_open": true, // bool
    "created_on": "2023-10-20 09:54:25" // string in format "YYYY-MM-DD HH:MM:SS"
}
```

### Close Room By Id

**Post <http://localhost:3005/api/v1/room/close>**

Request:

```json
{
    "room_id": 1, // uint
}
```

Response:

```json
{
    "room_id": 1, // uint
    "question_id": "df2374892143", // string
    "user_a_id": 1, // uint
    "user_b_id": 2, // uint
    "is_open": false, // bool
    "created_on": "2023-10-20 09:54:25" // string in format "YYYY-MM-DD HH:MM:SS"
}
```
