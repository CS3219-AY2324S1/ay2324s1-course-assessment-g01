package models

type Collaboration struct {
	RoomId     uint   `json:"room_id" gorm:"not null"`
	QuestionId string `json:"question_id" gorm:"not null"`
	UserAId    uint   `json:"user_a_id" gorm:"not null"`
	UserBId    uint   `json:"user_b_id" gorm:"not null"`
	CreatedOn  string `json:"created_on" gorm:"not null"`
}
