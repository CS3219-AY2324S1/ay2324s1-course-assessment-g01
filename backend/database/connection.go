package database

import (
	"backend/config"
	"backend/models"
	"fmt"

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
	ClearTables(connection)
	CreateTables(connection)
	AddMockData()
}

func CreateTables(db *gorm.DB) {
	db.AutoMigrate(&models.User{})
}

func AddMockData() {
	AddUser("abby@test.com", "abby123456", "abby", 1)
	AddUser("bob@test.com", "bob123456", "bob", 1)
	AddUser("cassie@test.com", "cassie123456", "cassie", 2)
	AddUser("david@test.com", "david123456", "david", 2)
	AddUser("emily@test.com", "emily123456", "emily", 3)
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

// Remove all records from the tables.
func ClearTables(db *gorm.DB) {
	cols := [1]string{"users"}
	for _, col := range cols {
		s := fmt.Sprintf("DROP TABLE IF EXISTS %s", col)
		db.Exec(s)
	}
}
