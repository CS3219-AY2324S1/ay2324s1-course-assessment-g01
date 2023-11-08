package services

import (
	"fmt"
	"history-service/config"
	"history-service/models"
	"history-service/utils"
	"net/http"
)

func GetQuestionById(id string) (models.Question, error) {
	resp, err := MakeGetRequest(config.GetQuestionServiceURL()+"/"+id,
		"")

	if err != nil || resp.StatusCode != http.StatusOK {
		fmt.Println("Error getting random question id")
		return models.Question{}, err
	}

	// parse response body into a Question struct
	var question models.Question
	err = utils.ParseResponseBody(resp, &question)
	if err != nil {
		fmt.Println("Error parsing response body")
		return models.Question{}, err
	}

	return question, nil
}
