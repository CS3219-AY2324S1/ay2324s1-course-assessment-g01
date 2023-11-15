package controllers

import (
	"collaboration-service/database"
	"collaboration-service/models"
	"collaboration-service/utils"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
)

func GetRoomById(c *fiber.Ctx) error {

	// Parse the id from the request url
	userId := c.Query("id")
	id, err := strconv.Atoi(userId)
	if err != nil {
		return utils.ErrorResponse(c, utils.InvalidId)
	}

	var room models.Room

	// Find room by id
	if err := database.DB.Where("room_id = ?", id).First(&room).Error; err != nil {
		c.Status(fiber.StatusNotFound)
		return utils.ErrorResponse(c, utils.RoomNotFound)
	}

	return utils.GetRequestResponse(c, room)
}

func CreateRoom(c *fiber.Ctx) error {
	var room models.Room

	location, err := time.LoadLocation("Singapore")
	if err != nil {
		return utils.ErrorResponse(c, utils.InternalServerError)
	}

	room.CreatedOn = time.Now().In(location).Format("2006-01-02 15:04:05")

	// Parse the request body into data
	if err := c.BodyParser(&room); err != nil {
		return err
	}

	if err := database.DB.Create(&room).Error; err != nil {
		return utils.ErrorResponse(c, utils.DuplicateRecord)
	}

	return utils.CreateRequestResponse(c, room)
}

func CloseRoom(c *fiber.Ctx) error {
	var room models.Room

	// Parse the request body into data
	if err := c.BodyParser(&room); err != nil {
		return err
	}

	// Find room by id
	res := database.DB.Where("room_id = ?", room.RoomId).First(&room)
	if res.RowsAffected == 0 {
		return utils.ErrorResponse(c, utils.RecordNotFound)
	}

	room.IsOpen = false
	database.DB.Save(&room)
	return utils.UpdateRequestResponse(c, room)
}
