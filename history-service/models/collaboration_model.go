package models

type Collaboration struct {
	Collaboration  uint   `json:"collaboration_id" gorm:"primaryKey;gorm:autoIncrement"`
	Roomid         string `json:"room_id" gorm:"not null"`
	QuestionId     string `json:"question_id" gorm:"not null"`
	UserAId        uint   `json:"user_a_id" gorm:"not null"`
	UserBId        uint   `json:"user_b_id" gorm:"not null"`
	CollaboratedOn string `json:"collaborated_on" gorm:"not null"`
}
