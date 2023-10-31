package database

import (
	"history-service/config"
	"history-service/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	connection, err := gorm.Open(postgres.New(postgres.Config{
		DSN: config.GetPostgresConnectionStr(),
	}), &gorm.Config{})

	if err != nil {
		panic("could not connect to the database")
	}
	DB = connection
	CreateTables(connection)
}

func CreateTables(db *gorm.DB) {
	db.AutoMigrate(&models.Attempt{})
}
