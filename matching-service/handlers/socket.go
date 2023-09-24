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
	// create a Message object
	var message models.Message

	// unmarshal the message into the Message object
	err := json.Unmarshal(msg, &message)

	// if there is an error, return an error message
	if err != nil {
		return []byte(utils.UnmarshalError)
	}

	// set the socket in the store
	store.SetSocket(message.UserId, s)

	// handle type of message accordingly
	res := parseAndRun(message, &msg, ch, store)

	// return the message
	return []byte(res)
}

// parses the message type and runs the appropriate handler
func parseAndRun(message models.Message, request *[]byte, ch *amqp091.Channel, store *utils.SocketStore) string {
	switch message.Message {
	case models.StartMatch:
		return handleStart(request, ch)
	case models.StopMatch:
		return handleStop(message, store)
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
func handleStop(m models.Message, s *utils.SocketStore) string {
	// delete the socket from the store
	s.DeleteSocket(m.UserId)
	return "User " + strconv.FormatUint(uint64(m.UserId), 10) + " stopped matching"
}
