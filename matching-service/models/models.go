package models

type User struct {
	UserId uint   `json:"user_id"`
	Status Status `json:"status"`
}

type UserRequest struct {
	User       User       `json:"user"`
	Difficulty Difficulty `json:"difficulty"`
}

type Message struct {
	UserId  uint        `json:"user_id"`
	Message MessageType `json:"message"`
}

// a room contains 2 users
type Room struct {
	RoomId uint `json:"room_id"`
	User1  User `json:"user_1"`
	User2  User `json:"user_2"`
}

// enum for difficulty
type Difficulty string

const (
	Easy   Difficulty = "Easy"
	Medium Difficulty = "Medium"
	Hard   Difficulty = "Hard"
)

// enum for status
type Status string

const (
	Waiting Status = "Waiting"
	Matched Status = "Matched"
)

// enum for message type
type MessageType string

const (
	StartMatch MessageType = "Start"
	StopMatch  MessageType = "Stop"
)
