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
func GetServicePort() string {
	return ":" + GoDotEnvVariable("MATCHING_SERVICE_PORT")
}

func GetRabbitMQConnString() string {
	conn := fmt.Sprint(
		"amqp://", GoDotEnvVariable("RABBITMQ_USER"),
		":", GoDotEnvVariable("RABBITMQ_PASS"),
		"@", GoDotEnvVariable("RABBITMQ_HOST"),
		":", GoDotEnvVariable("RABBITMQ_PORT"),
	)
	return conn
}
