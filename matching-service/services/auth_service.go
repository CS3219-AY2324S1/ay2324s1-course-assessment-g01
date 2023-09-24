package services

import (
	"encoding/json"
	"fmt"
	"matching-service/config"
	"matching-service/models"
	"net/http"
)

func AreUserIdsMatch(resp *http.Response, user_id uint) (bool, error) {
	// unmarshal the response body into a Response struct
	var user models.User
	err := json.NewDecoder(resp.Body).Decode(&user)
	if err != nil {
		return false, err
	}

	// access the variable of the key in the Response struct
	variable := user.UserId

	return variable == user_id, nil
}

func IsRequestAuthentic(userRequest models.User) (bool, error) {
	resp, auth_err := MakePostRequest(config.GetUserServiceURL(), nil, userRequest.JWT)
	if auth_err != nil || resp.StatusCode != http.StatusOK {
		return false, auth_err
	}
	// Check if the user ids match
	match, match_err := AreUserIdsMatch(resp, userRequest.UserId)
	if match_err != nil || !match {
		return false, match_err
	}
	fmt.Print("Authenticated user\n")
	return true, nil
}
