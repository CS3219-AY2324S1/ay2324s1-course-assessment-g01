package routes

import (
	"collaboration-service/controllers"

	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {
	api := app.Group("/api/v1")

	room_api := api.Group("/room")
	room_api.Get("", controllers.GetRoomById)
	room_api.Post("/create", controllers.CreateRoom)
	room_api.Post("/delete", controllers.DeleteRoomById)
}
