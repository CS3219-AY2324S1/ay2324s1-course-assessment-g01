package database

import (
	"fmt"
	"history-service/models"

	"gorm.io/gorm"
)

func AddMockData() {
	AddAttempt(1, "1", "code1", "python", true, "2021-01-01")
	AddAttempt(1, "2", "code2", "js", true, "2021-01-01")
}

// Remove all records from the tables.
func ClearTables(db *gorm.DB) {
	cols := [1]string{"attempts"}
	for _, col := range cols {
		s := fmt.Sprintf("DROP TABLE IF EXISTS %s", col)
		db.Exec(s)
	}
}

func AddAttempt(userId uint, questionId string, code string, language string, passed bool, attemptedOn string) {
	attempt := models.Attempt{
		QuestionId: questionId,
		UserId:     userId,
		Code:       code,
		Language:   language,
		Passed:     passed,
	}

	DB.Create(&attempt)
}
