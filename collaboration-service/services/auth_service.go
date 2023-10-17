package services

import (
	"collaboration-service/config"
	"net/http"
)

func IsRequestAuthentic(jwt string) bool {
	resp, auth_err := MakePostRequest(config.GetUserServiceURL(), nil, jwt)
	if auth_err != nil || resp.StatusCode != http.StatusOK {
		return false
	}
	return true
}
