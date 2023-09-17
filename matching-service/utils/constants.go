package utils

const (
	// Go Errors
	UnmarshalError             = "Error: Invalid message format"
	InvalidMessageTypeError    = "Error: Invalid message type"
	DifficultyUnspecifiedError = "Error: Difficulty not specified"
	EnvironmentFileError       = "Error: Environment file load failed"

	// RabbitMQ Errors
	RabbitMQConnectionError = "Error: Failed to connect to RabbitMQ"
	RabbitMQChannelError    = "Error: Failed to open a channel"
	RabbitMQQueueError      = "Error: Failed to declare a queue"
	RabbitMQPublishError    = "Error: Failed to publish a message"
	RabbitMQConsumeError    = "Error: Failed to register a consumer"

	// General
	MatchingServicePortLog = "matching-service listening on port "
	HelloMessage           = "Hello from matching-service!"
)
