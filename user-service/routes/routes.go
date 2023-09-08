package routes

import (
	"backend/controllers"

	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {
	api := app.Group("/api/v1")

	user_api := api.Group("/user")
	user_api.Get("", controllers.GetUserById)
	user_api.Post("", controllers.UserJwt)
	user_api.Get("/all", controllers.GetAllUsers)
	user_api.Post("/register", controllers.Register)
	user_api.Post("/deregister", controllers.Deregister)
	user_api.Post("/login", controllers.Login)
	user_api.Post("/resetpassword", controllers.ResetPassword)
	user_api.Post("/changepassword", controllers.ChangePassword)
	user_api.Post("/changename", controllers.ChangeName)

}
