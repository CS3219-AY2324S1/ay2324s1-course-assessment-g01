package controllers

import (
	"backend/database"
	"backend/models"
	"backend/utils"
	"strconv"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

const SecretKey = "secret"

func UserJwt(c *fiber.Ctx) error {

	// Get the Authorization header from the request
	authHeader := c.Get("Authorization")

	// Check if the Authorization header is empty
	if authHeader == "" {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "Unauthorized",
		})
	}

	// Split the Authorization header into two parts: "Bearer" and the token
	parts := strings.Split(authHeader, " ")
	if len(parts) != 2 || parts[0] != "Bearer" {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "Invalid token",
		})
	}

	// Get the token from the Authorization header
	token := parts[1]

	user, err := utils.GetCurrentUser(c, SecretKey, token)

	if err != nil {
		c.Status(fiber.StatusNotFound)
		return utils.ErrorResponse(c, utils.UserNotFound)
	}
	return utils.GetRequestResponse(c, user)
}

func GetUserById(c *fiber.Ctx) error {
	userId := c.Query("id")
	id, err := strconv.Atoi(userId)
	if err != nil {
		return utils.ErrorResponse(c, utils.InvalidId)
	}

	var user models.User

	if err := database.DB.Where("user_id = ?", id).First(&user).Error; err != nil {
		c.Status(fiber.StatusNotFound)
		return utils.ErrorResponse(c, utils.UserNotFound)
	}

	return utils.GetRequestResponse(c, user)
}

func GetAllUsers(c *fiber.Ctx) error {
	var users []models.User

	database.DB.Find(&users)
	return utils.GetRequestResponse(c, users)
}

func Register(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	password, _ := bcrypt.GenerateFromPassword([]byte(data["password"]), 14)
	access_type, err := utils.ParseUint(data["access_type"])
	if err != nil {
		return err
	}

	user := models.User{
		Email:      data["email"],
		Password:   password,
		Name:       data["name"],
		AccessType: access_type,
	}

	if err := database.DB.Create(&user).Error; err != nil {
		return utils.ErrorResponse(c, utils.DuplicateRecord)
	}
	return utils.CreateRequestResponse(c, user)
}

func Deregister(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	var user models.User

	// Find user by user_id
	res := database.DB.Where("user_id = ?", data["user_id"]).First(&user)
	if res.RowsAffected == 0 {
		return utils.ErrorResponse(c, utils.RecordNotFound)
	}

	database.DB.Delete(&user)
	return utils.DeleteRequestResponse(c, user)
}

func Login(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	var user models.User

	database.DB.Where("email = ?", data["email"]).First(&user)

	if user.UserId == 0 {
		c.Status(fiber.StatusNotFound)
		return utils.ErrorResponse(c, utils.UserNotFound)
	}

	// Check password
	if err := bcrypt.CompareHashAndPassword(user.Password, []byte(data["password"])); err != nil {
		return utils.ErrorResponse(c, utils.IncorrectPassword)
	}

	// Create JWT token
	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
		Issuer:    strconv.Itoa(int(user.UserId)),
		ExpiresAt: time.Now().Add(time.Hour).Unix(), // 1 hour
	})

	token, err := claims.SignedString([]byte(SecretKey))

	if err != nil {
		return utils.ErrorResponse(c, utils.LogInError)
	}

	return utils.GetRequestResponse(c, fiber.Map{"jwt": token})
}

func ResetPassword(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	var user models.User

	// Generate a random password
	minSpecialChar := 1
	minNum := 1
	minUpperCase := 1
	passwordLength := 6
	newPw := utils.GeneratePassword(passwordLength, minSpecialChar, minNum, minUpperCase)
	hashedNewPw, _ := bcrypt.GenerateFromPassword([]byte(newPw), 14)
	emailTo := data["email"]

	// Find user with this email
	res := database.DB.Where("email = ?", emailTo).First(&user)
	if res.RowsAffected == 0 {
		return utils.ErrorResponse(c, utils.InvalidEmail)
	}

	// Update password of this user
	database.DB.Model(&user).Update("password", hashedNewPw)

	// Send an email to the user to give them the new password
	utils.SendEmail(newPw, emailTo)

	return utils.ResponseBody(c, newPw)
}

func ChangePassword(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	var user models.User
	hashedNewPw, _ := bcrypt.GenerateFromPassword([]byte(data["password"]), 14)

	// Find user with this email
	res := database.DB.Where("email = ?", data["email"]).First(&user)
	if res.RowsAffected == 0 {
		return utils.ErrorResponse(c, utils.InvalidEmail)
	}

	// Update password of this user
	database.DB.Model(&user).Update("password", hashedNewPw)

	return utils.ResponseBody(c, utils.PasswordChanged)
}

func ChangeName(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	var user models.User

	// Find user with this email
	res := database.DB.Where("email = ?", data["email"]).First(&user)
	if res.RowsAffected == 0 {
		return utils.ErrorResponse(c, utils.InvalidEmail)
	}

	// Update name of this user
	database.DB.Model(&user).Update("name", data["name"])

	return utils.ResponseBody(c, utils.NameChanged)
}
