package controllers

import (
	"history-service/database"
	"history-service/models"
	"history-service/services"
	"history-service/utils"
	"strconv"
	"time"

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

	// Create a slice of maps
	response := []map[string]interface{}{}

	for _, attempt := range attempts {
		// Get question from question service by questionId
		var question models.Question
		question, err := services.GetQuestionById(attempt.QuestionId)
		if err != nil {
			return utils.ErrorResponse(c, utils.QuestionNotFound)
		}

		// Create a map for this attempt and its question
		attemptMap := map[string]interface{}{
			"question": question,
			"attempt":  attempt,
		}

		// Add the map to the response slice
		response = append(response, attemptMap)
	}

	return utils.GetRequestResponse(c, response)
}

func AddUserAttempt(c *fiber.Ctx) error {
	var attempt models.Attempt

	location, err := time.LoadLocation("Singapore")
	if err != nil {
		return utils.ErrorResponse(c, utils.InternalServerError)
	}

	attempt.AttemptedOn = time.Now().In(location).Format("2006-01-02 15:04:05")

	// Parse the request body into data
	if err := c.BodyParser(&attempt); err != nil {
		return err
	}

	if err := database.DB.Create(&attempt).Error; err != nil {
		return utils.ErrorResponse(c, utils.CreateError)
	}

	return utils.CreateRequestResponse(c, attempt)
}
