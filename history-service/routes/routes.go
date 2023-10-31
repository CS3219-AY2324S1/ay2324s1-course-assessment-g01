package routes

import (
	"history-service/controllers"

	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {
	app.Get("/", func(c *fiber.Ctx) error {
		c.Status(200).JSON("Hello World!")
		return nil
	})
	api := app.Group("/api/v1")

	history_api := api.Group("/history")

	attempt_api := history_api.Group("/attempt")
	attempt_api.Get("", controllers.GetUserAttemptsByUserId)
	attempt_api.Post("", controllers.AddUserAttempt)

	collaboration_api := history_api.Group("/collaboration")
	collaboration_api.Get("", controllers.GetUserCollaborationByUserId)
}
