package utils

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"strconv"
)

func ParseResponseBody(resp *http.Response, data interface{}) error {
	// read the response body
	body, err := ioutil.ReadAll(resp.Body)
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
