package utils

import (
	"strings"

	"github.com/gofiber/fiber/v2"
)

func GetAuthBearerToken(c *fiber.Ctx) (string, error) {

	// Get the Authorization header from the request
	authHeader := c.Get("Authorization")

	// Check if the Authorization header is empty
	if authHeader == "" {
		c.Status(fiber.StatusUnauthorized)
		return "", c.JSON(fiber.Map{
			"message": "Missing token",
		})
	}

	// Split the Authorization header into two parts: "Bearer" and the token
	parts := strings.Split(authHeader, " ")
	if len(parts) != 2 || parts[0] != "Bearer" {
		c.Status(fiber.StatusUnauthorized)
		return "", c.JSON(fiber.Map{
			"message": "Invalid token",
		})
	}

	// Get the token from the Authorization header
	return parts[1], nil
}
