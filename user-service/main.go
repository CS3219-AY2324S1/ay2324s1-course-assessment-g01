package main

import (
	"fmt"
	"user-service/config"
	"user-service/database"
	"user-service/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	_ "github.com/lib/pq"
)

func main() {
	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowCredentials: true,
	}))

	db := database.Connect()
	routes.Setup(app, db)

	port := fmt.Sprintf(":%s", config.GoDotEnvVariable("REST_PORT"))

	app.Listen(port)
}
