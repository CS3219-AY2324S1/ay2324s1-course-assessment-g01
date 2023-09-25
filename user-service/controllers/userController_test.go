package controllers_test

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"net/http/httptest"
	"testing"
	"user-service/database"
	"user-service/models"
	"user-service/routes"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/gofiber/fiber/v2"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var mock_db *sql.DB
var app *fiber.App

func TestMain(m *testing.M) {
	// setup mock db
	mock_db, _, _ := sqlmock.New()
	db, _ := gorm.Open(postgres.New(postgres.Config{Conn: mock_db}), &gorm.Config{})
	defer mock_db.Close()

	database.CreateTables(db)
	app := fiber.New()
	routes.Setup(app, db)

	m.Run()

}

func TestRegister(t *testing.T) {
	var testUser bytes.Buffer
	json.NewEncoder(&testUser).Encode(models.User{Email: "test@test.com", Password: []byte("test"), Name: "test"})
	req := httptest.NewRequest("get", "/api/v1/register", &testUser)
	res, _ := app.Test(req)
	println(res)
}
