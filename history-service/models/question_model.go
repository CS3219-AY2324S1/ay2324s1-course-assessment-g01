package models

// enum for difficulty
type Difficulty string

const (
	Easy   Difficulty = "Easy"
	Medium Difficulty = "Medium"
	Hard   Difficulty = "Hard"
)

type Question struct {
	QuestionId  string     `json:"_id"`
	Title       string     `json:"title"`
	Difficulty  Difficulty `json:"complexity"`
	Description string     `json:"description"`
	Categories  []string   `json:"categories"`
}
