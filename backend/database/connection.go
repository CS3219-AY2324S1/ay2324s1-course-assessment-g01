package database

import (
	"backend/config"
	"backend/models"

	"golang.org/x/crypto/bcrypt"
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
	db.AutoMigrate(&models.User{})
}

func AddUser(email string, password string, name string, access_type uint) {
	pw, _ := bcrypt.GenerateFromPassword([]byte(password), 14)

	user := models.User{
		Email:      email,
		Password:   pw,
		Name:       name,
		AccessType: access_type,
	}

	DB.Create(&user)
}
