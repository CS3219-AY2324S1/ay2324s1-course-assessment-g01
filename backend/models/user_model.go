package models

type User struct {
	UserId     uint   `json:"user_id" gorm:"primaryKey;gorm:autoIncrement"`
	Email      string `json:"email" gorm:"unique;gorm:not null"`
	Password   []byte `json:"-"`
	Name       string `json:"name"`
	AccessType uint   `json:"access_type"` // 1: admin, 2: registered user, 3: unauthenticated/unauthorised user
}
