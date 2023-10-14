package services

import (
	"fmt"
	"matching-service/config"
	"matching-service/models"
	"matching-service/utils"
	"net/http"
)

func GetRandomQuestionId(difficulty string, token string) (models.Question, error) {
	resp, err := MakeGetRequest(config.GetQuestionServiceURL()+"/"+difficulty,
		token)

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
