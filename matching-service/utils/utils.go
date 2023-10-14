package utils

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"
)

func ParseResponseBody(resp *http.Response, data interface{}) error {
	// read the response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	// unmarshal the response body into the data parameter
	err = json.Unmarshal(body, &data)
	if err != nil {
		return err
	}

	return nil
}

func ConvertToString(id uint) string {
	return strconv.FormatUint(uint64(id), 10)
}

func ConvertModelToString(data interface{}) string {
	// Marshal the struct into JSON format
	jsonBytes, err := json.Marshal(data)
	if err != nil {
		fmt.Printf("Error marshaling struct: %v", err)
		return ""
	}

	// Convert the JSON bytes to a string
	return string(jsonBytes)
}
