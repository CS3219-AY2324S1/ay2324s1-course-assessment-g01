package routes

import (
	"collaboration-service/controllers"

	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {
	app.Get("/", func(c *fiber.Ctx) error {
		c.Status(200).JSON("Hello World!")
		return nil
	})
	api := app.Group("/api/v1")

	room_api := api.Group("/room")
	room_api.Get("", controllers.GetRoomById)
	room_api.Post("/create", controllers.CreateRoom)
	room_api.Post("/close", controllers.CloseRoom)
}
