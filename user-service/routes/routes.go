package routes

import (
	"user-service/controllers"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func Setup(app *fiber.App, db *gorm.DB) {
	api := app.Group("/api/v1")

	user_api := api.Group("/user")
	user_controller := controllers.UserController{DB: db}

	user_api.Get("", user_controller.GetUserById)
	user_api.Post("", user_controller.GetUserByJwt)
	user_api.Get("/all", user_controller.GetAllUsers)
	user_api.Post("/register", user_controller.Register)
	user_api.Post("/deregister", user_controller.Deregister)
	user_api.Post("/login", user_controller.Login)
	user_api.Post("/resetpassword", user_controller.ResetPassword)
	user_api.Post("/changepassword", user_controller.ChangePassword)
	user_api.Post("/changename", user_controller.ChangeName)

}
