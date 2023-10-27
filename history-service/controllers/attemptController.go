package controllers

import (
	"history-service/database"
	"history-service/models"
	"history-service/utils"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

func GetUserAttemptsByUserId(c *fiber.Ctx) error {

	// Parse the id from the request url
	userId := c.Query("userId")
	id, err := strconv.Atoi(userId)
	if err != nil {
		return utils.ErrorResponse(c, utils.InvalidUserId)
	}

	var attempts []models.Attempt

	// Find all attempts by user id
	if err := database.DB.Where("user_id = ?", id).Find(&attempts).Error; err != nil {
		c.Status(fiber.StatusNotFound)
		return utils.ErrorResponse(c, utils.AttemptNotFound)
	}

	return utils.GetRequestResponse(c, attempts)
}

func AddUserAttempt(c *fiber.Ctx) error {
	var attempt models.Attempt

	// Parse the request body into data
	if err := c.BodyParser(&attempt); err != nil {
		return err
	}

	if err := database.DB.Create(&attempt).Error; err != nil {
		return utils.ErrorResponse(c, utils.CreateError)
	}

	return utils.CreateRequestResponse(c, attempt)
}
