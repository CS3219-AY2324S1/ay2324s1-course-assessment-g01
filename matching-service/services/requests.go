package services

import (
	"bytes"
	"encoding/json"
	"net/http"
)

func MakePostRequest(url string, data interface{}, token string) (*http.Response, error) {
	var jsonData []byte
	var err error

	// marshal the data into a JSON object if it is not nil
	if data != nil {
		jsonData, err = json.Marshal(data)
		if err != nil {
			return nil, err
		}
	}

	// create a new HTTP request
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, err
	}

	// set the content type header
	req.Header.Set("Content-Type", "application/json")

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
