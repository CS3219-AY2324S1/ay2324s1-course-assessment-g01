package config

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Host     string
	Port     string
	Password string
	User     string
	DBName   string
	SSLMode  string
}

// use godot package to load/read the .env file and
// return the value of the key
func GoDotEnvVariable(key string) string {
	if os.Getenv(key) != "" {
		return os.Getenv(key)
	}

	// load .env file
	err := godotenv.Load(".env")

	if err != nil {
		log.Fatalf("Error loading .env file")
	}

	return os.Getenv(key)
}

func GetPostgresConnectionStr() string {
	config := Config{
		Host:     GoDotEnvVariable("PGHOST"),
		Port:     GoDotEnvVariable("PGPORT"),
		User:     GoDotEnvVariable("PGUSER"),
		Password: GoDotEnvVariable("PGPASSWORD"),
		DBName:   GoDotEnvVariable("PGDATABASE"),
		SSLMode:  GoDotEnvVariable("PGSSLMODE"),
	}

	postgresConnectionStr :=
		fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s",
			config.Host, config.User, config.Password, config.DBName, config.Port, config.SSLMode)

	return postgresConnectionStr
}
