package models

type Attempt struct {
	AttemptId   uint   `json:"attempt_id" gorm:"primaryKey;gorm:autoIncrement"`
	QuestionId  string `json:"question_id" gorm:"not null"`
	UserId      uint   `json:"user_id" gorm:"not null"`
	Code        string `json:"code" gorm:"not null"`
	Language    string `json:"language" gorm:"not null"`
	Passed      bool   `json:"passed" gorm:"not null"`
	AttemptedOn string `json:"attempted_on" gorm:"not null"`
}
