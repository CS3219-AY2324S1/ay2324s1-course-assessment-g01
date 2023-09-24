package handlers

import (
	"encoding/json"
	"matching-service/models"
	"matching-service/utils"

	"github.com/rabbitmq/amqp091-go"
)

// handles messages sent by a client
func HandleMessage(msg []byte, ch *amqp091.Channel) []byte {
	// create a Message object
	var message models.Message

	// unmarshal the message into the Message object
	err := json.Unmarshal(msg, &message)

	// if there is an error, return an error message
	if err != nil {
		return []byte(utils.UnmarshalError)
	}

	// handle type of message accordingly
	res := parseAndRun(message.Message, &msg, ch)

	// return the message
	return []byte(res)
}

// parses the message type and runs the appropriate handler
func parseAndRun(messageType models.MessageType, message *[]byte, ch *amqp091.Channel) string {
	switch messageType {
	case models.StartMatch:
		return handleStart(message, ch)
	case models.StopMatch:
		return handleStop()
	default:
		return utils.InvalidMessageTypeError
	}
}

// handles a start message
func handleStart(msg *[]byte, ch *amqp091.Channel) string {
	// unmarshal into UserRequest object
	var userRequest models.UserRequest
	err := json.Unmarshal(*msg, &userRequest)

	if err != nil {
		// unmarshal error check
		return utils.InvalidMessageTypeError
	} else if userRequest.Difficulty == "" {
		// difficulty presence check
		return utils.DifficultyUnspecifiedError
	}
	PublishMessage(ch, string(userRequest.Difficulty), userRequest)
	return string(userRequest.Difficulty)
}

// handles a stop message
func handleStop() string {
	return "Stop"
}
