package controllers

import (
	"history-service/database"
	"history-service/models"
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

	return utils.GetRequestResponse(c, collaborations)
}
