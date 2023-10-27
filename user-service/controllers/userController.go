package controllers

import (
	"strconv"
	"time"
	"user-service/models"
	"user-service/utils"

	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type UserController struct {
	DB        *gorm.DB
	SecretKey string
}

func (controller *UserController) GetUserByJwt(c *fiber.Ctx) error {

	token, err := utils.GetAuthBearerToken(c)

	if err != nil {
		return utils.UnauthorizedResponse(c, err.Error())
	}

	user, err := utils.GetCurrentUser(controller.DB, c, controller.SecretKey, token)

	if err != nil {
		return utils.UnauthorizedResponse(c, utils.UserNotFound)
	}
	return utils.GetRequestResponse(c, user)
}

func (controller *UserController) GetUserById(c *fiber.Ctx) error {
	userId := c.Query("id")
	id, err := strconv.Atoi(userId)
	if err != nil {
		return utils.ErrorResponse(c, utils.InvalidId)
	}

	var user models.User

	if err := controller.DB.Where("user_id = ?", id).First(&user).Error; err != nil {
		c.Status(fiber.StatusNotFound)
		return utils.ErrorResponse(c, utils.UserNotFound)
	}

	return utils.GetRequestResponse(c, user)
}

func (controller *UserController) GetAllUsers(c *fiber.Ctx) error {
	var users []models.User

	controller.DB.Find(&users)
	return utils.GetRequestResponse(c, users)
}

func (controller *UserController) Register(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	var user models.User

	token, authErr := utils.GetAuthBearerToken(c)

	if authErr != nil || token != controller.SecretKey {
		user.AccessType = 2
	}

	password, _ := bcrypt.GenerateFromPassword([]byte(data["password"]), bcrypt.DefaultCost)
	user.Password = password

	if err := controller.DB.Create(&user).Error; err != nil {
		return utils.ErrorResponse(c, utils.DuplicateRecord)
	}
	return utils.CreateRequestResponse(c, user)
}

func (controller *UserController) Deregister(c *fiber.Ctx) error {
	var user models.User

	if err := c.BodyParser(&user); err != nil {
		return err
	}

	// Find user by user_id
	res := controller.DB.Where("user_id = ?", user.UserId).First(&user)
	if res.RowsAffected == 0 {
		return utils.ErrorResponse(c, utils.RecordNotFound)
	}

	controller.DB.Delete(&user)
	return utils.DeleteRequestResponse(c, user)
}

func (controller *UserController) Login(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return err
	}
	inputPassword := data["password"]

	var user models.User
	controller.DB.Where("email = ?", data["email"]).First(&user)

	if user.UserId == 0 {
		c.Status(fiber.StatusNotFound)
		return utils.ErrorResponse(c, utils.UserNotFound)
	}

	// Check password
	if err := bcrypt.CompareHashAndPassword(user.Password, []byte(inputPassword)); err != nil {
		return utils.ErrorResponse(c, utils.IncorrectPassword)
	}

	// Create JWT token
	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"iss":   "Peerprep",
		"aud":   "User",
		"iat":   time.Now().Unix(),
		"sub":   strconv.Itoa(int(user.UserId)),
		"exp":   time.Now().Add(time.Hour).Unix(), // 1 hour
		"roles": strconv.Itoa(int(user.AccessType)),
	})

	token, err := claims.SignedString([]byte(controller.SecretKey))

	if err != nil {
		return utils.ErrorResponse(c, utils.LogInError)
	}

	return utils.GetRequestResponse(c, fiber.Map{"jwt": token})
}

func (controller *UserController) ResetPassword(c *fiber.Ctx) error {
	var user models.User

	if err := c.BodyParser(&user); err != nil {
		return err
	}

	// Generate a random password
	minSpecialChar := 1
	minNum := 1
	minUpperCase := 1
	passwordLength := 6
	newPw := utils.GeneratePassword(passwordLength, minSpecialChar, minNum, minUpperCase)
	hashedNewPw, _ := bcrypt.GenerateFromPassword([]byte(newPw), 14)
	emailTo := user.Email

	// Find user with this email
	res := controller.DB.Where("email = ?", emailTo).First(&user)
	if res.RowsAffected == 0 {
		return utils.ErrorResponse(c, utils.InvalidEmail)
	}

	// Update password of this user
	controller.DB.Model(&user).Update("password", hashedNewPw)

	// Send an email to the user to give them the new password
	utils.SendEmail(newPw, emailTo)

	return utils.ResponseBody(c, newPw)
}

func (controller *UserController) ChangePassword(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	var user models.User
	hashedNewPw, _ := bcrypt.GenerateFromPassword([]byte(data["password"]), bcrypt.DefaultCost)

	// Find user with this email
	res := controller.DB.Where("email = ?", data["email"]).First(&user)
	if res.RowsAffected == 0 {
		return utils.ErrorResponse(c, utils.InvalidEmail)
	}

	// Update password of this user
	controller.DB.Model(&user).Update("password", hashedNewPw)

	return utils.ResponseBody(c, utils.PasswordChanged)
}

func (controller *UserController) ChangeName(c *fiber.Ctx) error {
	var user models.User

	if err := c.BodyParser(&user); err != nil {
		return err
	}

	// Find user with this email
	res := controller.DB.Where("email = ?", user.Email).First(&user)
	if res.RowsAffected == 0 {
		return utils.ErrorResponse(c, utils.InvalidEmail)
	}

	// Update name of this user
	controller.DB.Model(&user).Update("name", user.Name)

	return utils.ResponseBody(c, utils.NameChanged)
}
