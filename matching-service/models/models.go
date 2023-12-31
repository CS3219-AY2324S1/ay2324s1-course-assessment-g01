package models

type User struct {
	UserId     uint       `json:"user_id"`
	RoomId     uint       `json:"room_id"`
	Difficulty Difficulty `json:"difficulty"`
	Action     ActionType `json:"action"`
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
	StartMatch  ActionType = "Start"
	StopMatch   ActionType = "Stop"
	CancelMatch ActionType = "Cancel"
)

type Room struct {
	RoomId     uint   `json:"room_id"`
	QuestionId string `json:"question_id"`
	UserAId    uint   `json:"user_a_id"`
	UserBId    uint   `json:"user_b_id"`
	CreatedOn  string `json:"created_on"`
}

type Question struct {
	QuestionId  string     `json:"_id"`
	Title       string     `json:"title"`
	Difficulty  Difficulty `json:"complexity"`
	Description string     `json:"description"`
	Categories  []string   `json:"categories"`
}

type MatchedResponse struct {
	RoomId   uint     `json:"room_id"`
	Question Question `json:"question"`
}

type Error struct {
	Message string `json:"error"`
}
