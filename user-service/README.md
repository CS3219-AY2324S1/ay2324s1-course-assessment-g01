# Prerequisites

Before you begin, ensure you have installed:

- Go
- Docker

## Instructions to initialize PostgreSQL database and user-service

1. Open Docker.
2. Run docker compose command from the root directory. After the container is up, the database will be listening on [http://localhost:5001](http://localhost:5001)
3. After the container is up, the history service will be listening on [http://localhost:3000](http://localhost:3000)

```bash
docker compose up -d
```

## Using the user service

### Get user by user id

**Get <http://localhost:3000/api/v1/user>**

Response:

```json
{
    "user_id": 1,
    "email": "userA@example.com",
    "name": "userA",
    "access_type": 0
}
```

### Get user by JWT

**Post <http://localhost:3000/api/v1/user>**

Response:

```json
{
}
Authorization: Bearer <JWT>
```

### Get all users

**Get <http://localhost:3000/api/v1/user/all>**

Response:

```json
[
    {
        "user_id": 1,
        "email": "userA@example.com",
        "name": "userA",
        "access_type": 0
    }
]
```

### Register user

**Post <http://localhost:3000/api/v1/user/register>**

Request:

```json
{
    "email": "userA@example.com",
    "password": "123456", // must be at least 6 characters long
    "name": "userA" // must be at least 3 characters long
}

```

Response:

```json
{
    "user_id": 1,
    "email": "userA@example.com",
    "name": "userA",
    "access_type": 0
}
```

### Deregister user

**Post <http://localhost:3000/api/v1/user/deregister>**

Request:

```json
{
    "user_id": 1
}

```

Response:

```json
{
    "user_id": 1,
    "email": "userA@example.com",
    "name": "userA",
    "access_type": 0
}
```

### Login user

**Post <http://localhost:3000/api/v1/user/login>**

Request:

```json
{
    "email": "userA@example.com",
    "password": "123456"
}

```

Response:

```json
{
    "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJVc2VyIiwiZXhwIjoxNjk4NDE1MzQxLCJpYXQiOjE2OTg0MTE3NDEsImlzcyI6IlBlZXJwcmVwIiwicm9sZXMiOiIwIiwic3ViIjoiMiJ9.GGOfG6sPDF4B5EvcozEfrLuxmQVUE8UlnpU5okkI-VI"
}
```

### Reset password

**Post <http://localhost:3000/api/v1/user/resetpassword>**

Request:

```json
{
    "email": "userA@example.com"
}

```

Response:

```json
{
    "message": "L75bf*"
}
```

### Change password

**Post <http://localhost:3000/api/v1/user/changepassword>**

Request:

```json
{
    "email": "userA@example.com",
    "password": "456123" // new password
}

```

Response:

```json
{
    "message": "Password is changed"
}
```

### Change name

**Post <http://localhost:3000/api/v1/user/changename>**

Request:

```json
{
    "email": "userA@example.com",
    "name": "userAA"
}

```

Response:

```json
{
    "message": "User name is changed"
}
```
