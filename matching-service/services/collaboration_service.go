package services

import (
	"fmt"
	"matching-service/config"
	"matching-service/models"
	"matching-service/utils"
	"net/http"
)

func CreateRoom(userAId uint, userBId uint) (models.Room, error) {
	resp, err := MakePostRequest(config.GetCollaborationRoomServiceURL()+"/create",
		models.Room{UserAId: userAId, UserBId: userBId}, "")

	if err != nil || resp.StatusCode != http.StatusCreated {
		fmt.Println("Error creating room")
		return models.Room{}, err
	}
	// parse response body into a Room struct
	var room models.Room
	err = utils.ParseResponseBody(resp, &room)
	if err != nil {
		fmt.Println("Error parsing response body")
		return models.Room{}, err
	}

	return room, nil
}

func CloseRoom(roomId uint) error {
	resp, err := MakePostRequest(config.GetCollaborationRoomServiceURL()+"/close",
		models.Room{RoomId: roomId}, "")

	if err != nil || resp.StatusCode != http.StatusOK {
		fmt.Println("Error closing room")
		return err
	}

	return nil
}
