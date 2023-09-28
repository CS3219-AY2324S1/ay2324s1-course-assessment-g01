package models

type User struct {
	UserId     uint       `json:"user_id"`
	RoomId     uint       `json:"room_id"`
	Difficulty Difficulty `json:"difficulty"`
	Action     ActionType `json:"action"`
	JWT        string     `json:"jwt"`
}

// enum for difficulty
type Difficulty string

const (
	Easy   Difficulty = "Easy"
	Medium Difficulty = "Medium"
	Hard   Difficulty = "Hard"
)

// enum for action type
type ActionType string

const (
	StartMatch ActionType = "Start"
	StopMatch  ActionType = "Stop"
)

type Room struct {
	RoomId  uint `json:"room_id"`
	UserAId uint `json:"user_a_id"`
	UserBId uint `json:"user_b_id"`
}
