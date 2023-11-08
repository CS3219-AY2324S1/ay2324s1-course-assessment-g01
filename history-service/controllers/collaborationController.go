package controllers

import (
	"history-service/database"
	"history-service/models"
	"history-service/services"
	"history-service/utils"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

func GetUserCollaborationByUserId(c *fiber.Ctx) error {

	// Parse the id from the request url
	userId := c.Query("userId")
	id, err := strconv.Atoi(userId)
	if err != nil {
		return utils.ErrorResponse(c, utils.InvalidUserId)
	}

	var collaborations []models.Collaboration

	if err := database.DB.Raw("SELECT room_id, question_id, user_a_id, user_b_id, created_on FROM rooms WHERE user_a_id = ? OR user_b_id = ?", id, id).Find(&collaborations).Error; err != nil {
		c.Status(fiber.StatusNotFound)
		return utils.ErrorResponse(c, utils.CollaborationNotFound)
	}

	// Create a slice of maps
	response := []map[string]interface{}{}

	for _, collab := range collaborations {
		// Get question from question service by questionId
		var question models.Question
		question, err := services.GetQuestionById(collab.QuestionId)
		if err != nil {
			return utils.ErrorResponse(c, utils.QuestionNotFound)
		}

		// Create a map for this collaboration and its question
		collabMap := map[string]interface{}{
			"question":      question,
			"collaboration": collab,
		}

		// Add the map to the response slice
		response = append(response, collabMap)
	}

	return utils.GetRequestResponse(c, response)
}
