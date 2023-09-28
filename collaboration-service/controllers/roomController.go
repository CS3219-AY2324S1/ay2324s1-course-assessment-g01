package controllers

import (
	"collaboration-service/database"
	"collaboration-service/models"
	"collaboration-service/utils"
	"strconv"

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
	var data map[string]uint

	// Parse the request body into data
	if err := c.BodyParser(&data); err != nil {
		return err
	}

	room := models.Room{
		UserAId: data["user_a_id"],
		UserBId: data["user_b_id"],
	}

	if err := database.DB.Create(&room).Error; err != nil {
		return utils.ErrorResponse(c, utils.DuplicateRecord)
	}

	return utils.CreateRequestResponse(c, room)
}

func CloseRoom(c *fiber.Ctx) error {
	var data map[string]uint

	// Parse the request body into data
	if err := c.BodyParser(&data); err != nil {
		return err
	}

	var room models.Room

	// Find room by id
	res := database.DB.Where("room_id = ?", data["id"]).First(&room)
	if res.RowsAffected == 0 {
		return utils.ErrorResponse(c, utils.RecordNotFound)
	}

	room.IsOpen = false
	database.DB.Save(&room)
	return utils.UpdateRequestResponse(c, room)
}

func DeleteRoomById(c *fiber.Ctx) error {
	var data map[string]uint

	// Parse the request body into data
	if err := c.BodyParser(&data); err != nil {
		return err
	}

	var room models.Room

	// Find room by id
	res := database.DB.Where("room_id = ?", data["id"]).First(&room)
	if res.RowsAffected == 0 {
		return utils.ErrorResponse(c, utils.RecordNotFound)
	}

	database.DB.Delete(&room)
	return utils.DeleteRequestResponse(c, room)
}
