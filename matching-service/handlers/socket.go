package handlers

import (
	"encoding/json"
	"matching-service/models"
	"matching-service/utils"

	"github.com/olahol/melody"
	"github.com/rabbitmq/amqp091-go"
)

// handles messages sent by a client
func HandleMessage(msg []byte, ch *amqp091.Channel, store *utils.SocketStore, s *melody.Session) []byte {
	// create a User object
	var user models.User

	// unmarshal the message into the Message object
	err := json.Unmarshal(msg, &user)

	// unmarshal error check
	if err != nil {
		return []byte(utils.UnmarshalError)
	}

	// set the socket in the store
	store.SetSocket(user.UserId, s)

	// handle type of message accordingly
	res := parseAndRun(user, ch, store)

	// return the message
	return []byte(res)
}

// parses the message type and runs the appropriate handler
func parseAndRun(user models.User, ch *amqp091.Channel, store *utils.SocketStore) string {
	switch user.Action {
	case models.StopMatch:
		return handleStop(user, ch)
	case models.CancelMatch:
		fallthrough
	case models.StartMatch:
		return handleStart(user, ch)
	default:
		return utils.InvalidMessageTypeError
	}
}

// handles a start message
func handleStart(user models.User, ch *amqp091.Channel) string {
	if user.Difficulty == "" {
		// difficulty presence check
		return utils.DifficultyUnspecifiedError
	}
	difficulty := string(user.Difficulty)
	PublishMessage(ch, difficulty, user)
	return difficulty
}

// handles a stop message
func handleStop(user models.User, ch *amqp091.Channel) string {
	if user.Action == "" {
		// action presence check
		return utils.ActionUnspecifiedError
	}
	PublishMessage(ch, string(user.Action), user)
	return string(user.Action)
}
