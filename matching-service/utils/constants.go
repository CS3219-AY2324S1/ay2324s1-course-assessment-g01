package utils

const (
	// Auth Errors
	UserAuthError = "Error: User authentication failed"

	// Room Errors
	RoomCreationError = "Error: Room creation failed"
	RoomCloseError    = "Error: Room close failed"

	// Go Errors
	UnmarshalError             = "Error: Invalid message format"
	InvalidMessageTypeError    = "Error: Invalid message type"
	DifficultyUnspecifiedError = "Error: Difficulty not specified"
	ActionUnspecifiedError     = "Error: Action not specified"
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
