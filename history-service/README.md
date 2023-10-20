# Prerequisites

Before you begin, ensure you have installed:

- Go
- Docker

## Instructions to initialize PostgreSQL database and history-service

1. Open Docker.
2. Run docker compose command from the root directory. After the container is up, the database will be listening on [http://localhost:5001](http://localhost:5001)
3. After the container is up, the history service will be listening on [http://localhost:3008](http://localhost:3008)

```bash
docker compose up -d
```

## Using the history service

### Get user attempts by user id

**Get <http://localhost:3008/api/v1/history/attempt?userId=1>**

Response:

```json
[
    {
        "question_id": "df2374892143", // string
        "user_id": 1, // uint
        "code": "print('hello world')",
        "language": "python", // python, javascript, java, c, c++, c#
        "passed": true, // failed - false, passed - true
        "attempted_on": ""
    }
]
```

### Add user attempt

**Post <http://localhost:3008/api/v1/history/attempt>**

Request:

```json
{
    "question_id": "df2374892143", // string
    "user_id": 1, // uint
    "code": "print('hello world')",
    "language": "python", // python, javascript, java, c, c++, c#
    "passed": true, // failed - false, passed - true
}
```

Response:

```json
{
    "question_id": "df2374892143", // string
    "user_id": 1, // uint
    "code": "print('hello world')",
    "language": "python", // python, javascript, java, c, c++, c#
    "result": "passed", // Passed or Failed
    "submitted_datetime": ""
}
```

### Get user collaboration by user id

**Get <http://localhost:3008/api/v1/history/collaboration?userId=1>**

Response:

```json
[
    {
        "room_id": 1, // uint
        "question_id": "df2374892143", // string
        "user_a_id": 1, // uint
        "user_b_id": 2, // uint
        "created_on": "2023-10-20 09:54:25" // string in format "YYYY-MM-DD HH:MM:SS"
    }
]
```
