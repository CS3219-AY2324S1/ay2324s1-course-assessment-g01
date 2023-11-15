package services

import (
	"net/http"
)

func MakeGetRequest(url string, token string) (*http.Response, error) {
	// create a new HTTP request
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	// set the authorization header with the bearer token if it is not empty
	if token != "" {
		req.Header.Set("Authorization", "Bearer "+token)
	}

	// create a new HTTP client
	client := &http.Client{}

	// send the request
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}

	return resp, nil
}
