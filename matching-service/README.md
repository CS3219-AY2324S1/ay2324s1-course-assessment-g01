# Prerequisites

Before you begin, ensure you have installed:

- Go
- Docker

## Instructions to initialize RabbitMQ store and matching service

1. Open Docker.
2. Run docker compose command from the root directory. 
3. After the container is up, the RabbitMQ store will be listening on [http://localhost:15672](http://localhost:15672) (5672 for development).
4. After the container is up, the matching service will be listening on [http://localhost:8082](http://localhost:8082) for socket connections. 

```bash
docker compose up -d
```

## Using the matching service

The following actions can be done:

- GET request to http://localhost:8082 - to check if the service is running.
- Websocket connections to ws://localhost:8082/ws
  - The websocket accepts JSON data in the following format:

```json
{
    "user_id": 1, // uint
    "message": "Start", // Start/Stop
    "difficulty": "Easy" // Required for "Start", optional for the rest - Easy/Medium/Hard
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