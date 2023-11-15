package utils

import (
	"encoding/json"
	"io"
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

func GetRequestResponse(c *fiber.Ctx, data interface{}) error {
	return c.Status(http.StatusOK).JSON(data)
}

func CreateRequestResponse(c *fiber.Ctx, data interface{}) error {
	return c.Status(http.StatusCreated).JSON(data)
}

func DeleteRequestResponse(c *fiber.Ctx, data interface{}) error {
	return c.Status(http.StatusAccepted).JSON(data)
}

func UpdateRequestResponse(c *fiber.Ctx, data interface{}) error {
	return c.Status(http.StatusAccepted).JSON(data)
}

func ParseResponseBody(resp *http.Response, data interface{}) error {
	// read the response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	// unmarshal the response body into the data parameter
	err = json.Unmarshal(body, &data)
	if err != nil {
		return err
	}

	return nil
}
