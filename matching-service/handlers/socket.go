package handlers

import (
	"encoding/json"
	"matching-service/models"
	"matching-service/utils"
	"strconv"

	"github.com/olahol/melody"
	"github.com/rabbitmq/amqp091-go"
)

// handles messages sent by a client
func HandleMessage(msg []byte, ch *amqp091.Channel, store *utils.SocketStore, s *melody.Session) []byte {
	// create a User object
	var user models.User

	// unmarshal the message into the Message object
	err := json.Unmarshal(msg, &user)

	// if there is an error, return an error message
	if err != nil {
		return []byte(utils.UnmarshalError)
	}

	// set the socket in the store
	store.SetSocket(user.UserId, s)

	// handle type of message accordingly
	res := parseAndRun(user, &msg, ch, store)

	// return the message
	return []byte(res)
}

// parses the message type and runs the appropriate handler
func parseAndRun(user models.User, request *[]byte, ch *amqp091.Channel, store *utils.SocketStore) string {
	switch user.Message {
	case models.StartMatch:
		return handleStart(request, ch)
	case models.StopMatch:
		return handleStop(user, store)
	default:
		return utils.InvalidMessageTypeError
	}
}

// handles a start message
func handleStart(msg *[]byte, ch *amqp091.Channel) string {
	// unmarshal into UserRequest object
	var user models.User
	err := json.Unmarshal(*msg, &user)

	if err != nil {
		// unmarshal error check
		return utils.InvalidMessageTypeError
	} else if user.Difficulty == "" {
		// difficulty presence check
		return utils.DifficultyUnspecifiedError
	}
	PublishMessage(ch, string(user.Difficulty), user)
	return string(user.Difficulty)
}

// handles a stop message
func handleStop(u models.User, s *utils.SocketStore) string {
	// delete the socket from the store
	s.DeleteSocket(u.UserId)
	return "User " + strconv.FormatUint(uint64(u.UserId), 10) + " stopped matching"
}
