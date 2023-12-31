package config

import (
	"fmt"
	"log"
	"matching-service/utils"
	"os"

	"github.com/joho/godotenv"
)

// use godot package to load/read the .env file and
// return the value of the key
func GoDotEnvVariable(key string) string {
	if os.Getenv(key) != "" {
		return os.Getenv(key)
	}

	// load .env file
	err := godotenv.Load(".env")

	if err != nil {
		log.Fatalf(utils.EnvironmentFileError)
	}

	return os.Getenv(key)
}

// return port used by matching-service
func GetMatchingServicePort() string {
	return ":" + GoDotEnvVariable("MATCHING_SERVICE_PORT")
}

// return port used by user-service
func GetUserServicePort() string {
	return ":" + GoDotEnvVariable("USER_SERVICE_PORT")
}

func GetCollaborationServicePort() string {
	return ":" + GoDotEnvVariable("COLLABORATION_SERVICE_PORT")
}

func GetQuestionServicePort() string {
	return ":" + GoDotEnvVariable("QUESTION_SERVICE_PORT")
}

func GetUserServiceURL() string {
	return "http://user-service" + GetUserServicePort() + "/api/v1/user"
}

func GetCollaborationRoomServiceURL() string {
	return "http://collaboration-service" + GetCollaborationServicePort() + "/api/v1/room"
}

func GetQuestionServiceURL() string {
	return "http://question-service" + GetQuestionServicePort() + "/api/v1/questions"
}

func GetRabbitMQConnString() string {
	conn := fmt.Sprint(
		"amqp://", GoDotEnvVariable("RABBITMQ_USER"),
		":", GoDotEnvVariable("RABBITMQ_PASS"),
		"@", GoDotEnvVariable("RABBITMQ_HOST"),
		":", GoDotEnvVariable("RABBITMQ_PORT"),
		"/", GoDotEnvVariable("RABBITMQ_VHOST"),
	)
	return conn
}
