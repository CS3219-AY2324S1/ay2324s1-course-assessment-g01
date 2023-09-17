package handlers

import (
	"encoding/json"
	"matching-service/models"
	"matching-service/utils"
)

// handles messages sent by a client
func HandleMessage(msg []byte) []byte {
	// create a Message object
	var message models.Message

	// unmarshal the message into the Message object
	err := json.Unmarshal(msg, &message)

	// if there is an error, return an error message
	if err != nil {
		return []byte(utils.UnmarshalError)
	}

	// handle type of message accordingly
	res := parseAndRun(message.Message, &msg)

	// return the message
	return []byte(res)
}

// parses the message type and runs the appropriate handler
func parseAndRun(messageType models.MessageType, message *[]byte) string {
	switch messageType {
	case models.StartMatch:
		return handleStart(message)
	case models.StopMatch:
		return handleStop()
	default:
		return utils.InvalidMessageTypeError
	}
}

// handles a start message
func handleStart(msg *[]byte) string {
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
	return string(userRequest.Difficulty)
}

// handles a stop message
func handleStop() string {
	return "Stop"
}
