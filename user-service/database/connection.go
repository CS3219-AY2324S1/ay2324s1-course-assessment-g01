package database

import (
	"user-service/config"
	"user-service/models"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func Connect() *gorm.DB {
	connection, err := gorm.Open(postgres.New(postgres.Config{
		DSN: config.GetPostgresConnectionStr(),
	}), &gorm.Config{})

	if err != nil {
		panic("could not connect to the database")
	}
	CreateTables(connection)
	return connection
}

func CreateTables(db *gorm.DB) {
	db.AutoMigrate(&models.User{})
}

func AddUser(db *gorm.DB, email string, password string, name string, access_type uint) {
	pw, _ := bcrypt.GenerateFromPassword([]byte(password), 14)

	user := models.User{
		Email:      email,
		Password:   pw,
		Name:       name,
		AccessType: access_type,
	}

	db.Create(&user)
}
