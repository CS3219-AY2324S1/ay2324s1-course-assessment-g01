package utils

import (
	"net/http"

	"github.com/gofiber/fiber/v2"
)

func ResponseBody(c *fiber.Ctx, msg string) error {
	return c.Status(http.StatusOK).JSON(fiber.Map{
		"message": msg,
	})
}

func ErrorResponse(c *fiber.Ctx, errMsg string) error {
	return c.Status(http.StatusNotFound).JSON(fiber.Map{
		"error": errMsg,
	})
}

func UnauthorizedResponse(c *fiber.Ctx, errMsg string) error {
	return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"error": errMsg})
}

func GetRequestResponse(c *fiber.Ctx, data interface{}) error {
	return c.Status(http.StatusOK).JSON(data)
}

func CreateRequestResponse(c *fiber.Ctx, data interface{}) error {
	return c.Status(http.StatusCreated).JSON(data)
}

func DeleteRequestResponse(c *fiber.Ctx, data interface{}) error {
	return c.Status(http.StatusAccepted).JSON(data)
}
