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
	var data map[string]interface{}

	// Parse the request body into data
	if err := c.BodyParser(&data); err != nil {
		return err
	}

	attempt := models.Attempt{
		QuestionId: data["question_id"].(string),
		UserId:     uint(data["user_id"].(float64)),
		Code:       data["code"].(string),
		Language:   data["language"].(string),
		Passed:     data["passed"].(bool),
	}

	if err := database.DB.Create(&attempt).Error; err != nil {
		return utils.ErrorResponse(c, utils.CreateError)
	}

	return utils.CreateRequestResponse(c, attempt)
}

func GetUserCollaborationByUserId(c *fiber.Ctx) error {

	// Parse the id from the request url
	userId := c.Query("userId")
	id, err := strconv.Atoi(userId)
	if err != nil {
		return utils.ErrorResponse(c, utils.InvalidUserId)
	}

	var collaborations models.Collaboration

	if err := database.DB.Raw("SELECT room_id, question_id, user_a_id, user_b_id, created_on FROM rooms WHERE user_a_id = ? OR user_b_id = ?", id, id).Find(&collaborations).Error; err != nil {
		c.Status(fiber.StatusNotFound)
		return utils.ErrorResponse(c, utils.CollaborationNotFound)
	}

	return utils.GetRequestResponse(c, collaborations)
}
