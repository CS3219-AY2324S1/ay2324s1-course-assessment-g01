package models

type User struct {
	UserId     uint        `json:"user_id"`
	Difficulty Difficulty  `json:"difficulty"`
	Message    MessageType `json:"message"`
	JWT        string      `json:"jwt"`
}

// enum for difficulty
type Difficulty string

const (
	Easy   Difficulty = "Easy"
	Medium Difficulty = "Medium"
	Hard   Difficulty = "Hard"
)

// enum for message type
type MessageType string

const (
	StartMatch MessageType = "Start"
	StopMatch  MessageType = "Stop"
)

type Room struct {
	RoomId  uint `json:"room_id"`
	UserAId uint `json:"user_a_id"`
	UserBId uint `json:"user_b_id"`
}
