package models

type Room struct {
	RoomId     uint   `json:"room_id" gorm:"primaryKey;gorm:autoIncrement"`
	QuestionId string `json:"question_id" gorm:"not null"`
	UserAId    uint   `json:"user_a_id" gorm:"not null"`
	UserBId    uint   `json:"user_b_id" gorm:"not null"`
	IsOpen     bool   `json:"is_open" gorm:"default:true"`
}
