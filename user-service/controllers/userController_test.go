package controllers_test

import (
	"context"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"
	"user-service/controllers"
	"user-service/database"

	"github.com/gofiber/fiber/v2"
	"github.com/testcontainers/testcontainers-go"
	dockerPostgres "github.com/testcontainers/testcontainers-go/modules/postgres"
	"github.com/testcontainers/testcontainers-go/wait"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var app *fiber.App
var userController *controllers.UserController

func TestMain(m *testing.M) {
	// setup mock db
	ctx := context.Background()

	postgresContainer, err := dockerPostgres.RunContainer(ctx,
		testcontainers.WithImage("docker.io/postgres:14-alpine"),
		dockerPostgres.WithDatabase("postgres"),
		dockerPostgres.WithUsername("postgres"),
		dockerPostgres.WithPassword("123"),
		testcontainers.WithWaitStrategy(
			wait.ForLog("database system is ready to accept connections").
				WithOccurrence(2).
				WithStartupTimeout(5*time.Second)),
	)
	if err != nil {
		panic(err)
	}

	// Clean up the container
	defer func() {
		if err := postgresContainer.Terminate(ctx); err != nil {
			panic(err)
		}
	}()
	connStr, err := postgresContainer.ConnectionString(ctx)
	if err != nil {
		panic(err)
	}
	db, _ := gorm.Open(postgres.New(postgres.Config{DSN: connStr}), &gorm.Config{})

	database.CreateTables(db)

	// setup mock app
	app = fiber.New()
	userController = &controllers.UserController{DB: db, SecretKey: "test"}

	m.Run()

}

func TestRegister(t *testing.T) {
	// setup route
	app.Post("/register", userController.Register)
	// setup request for route
	testUser := strings.NewReader(`{
		"email": "test@test.com",
		"password": "test",
		"name": "tester"
	}`)
	req := httptest.NewRequest(http.MethodPost, "/register", testUser)
	req.Header.Set("Content-Type", "application/json")

	res, _ := app.Test(req)
	if res.StatusCode != http.StatusCreated {
		body, _ := io.ReadAll(res.Body)

		t.Error("Error: ", res.StatusCode, string(body))
	}
}

// Registering with existing email
func TestRegisterTwice_Fail(t *testing.T) {
	// setup route
	app.Post("/register", userController.Register)
	// setup request for route
	testUser := strings.NewReader(`{
		"email": "test@test.com",
		"password": "test",
		"name": "tester"
	}`)
	req := httptest.NewRequest(http.MethodPost, "/register", testUser)
	req.Header.Set("Content-Type", "application/json")

	app.Test(req)
	res, _ := app.Test(req)
	if res.StatusCode != 404 {
		body, _ := io.ReadAll(res.Body)
		t.Error("Error: ", res.StatusCode, string(body))
	}
}

func TestLogin(t *testing.T) {
	// setup route
	app.Post("/login", userController.Login)
	// setup request for route
	testUser := strings.NewReader(`{
		"email": "test@test.com",
		"password": "test"
	}`)
	req := httptest.NewRequest(http.MethodPost, "/login", testUser)
	req.Header.Set("Content-Type", "application/json")

	res, _ := app.Test(req)
	if res.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(res.Body)
		t.Error("Error: ", res.StatusCode, string(body))
	}
}

func TestLogin_NonExistent(t *testing.T) {
	// setup route
	app.Post("/login", userController.Login)
	// setup request for route
	testUser := strings.NewReader(`{
		"email": "non_existent@test.com",
		"password": "test"
	}`)
	req := httptest.NewRequest(http.MethodPost, "/login", testUser)
	req.Header.Set("Content-Type", "application/json")

	res, _ := app.Test(req)
	if res.StatusCode != http.StatusNotFound {
		body, _ := io.ReadAll(res.Body)
		t.Error("Error: ", res.StatusCode, string(body))
	}
}
