package database

import (
	"collaboration-service/models"
	"fmt"

	"gorm.io/gorm"
)

func AddMockData() {
	AddRoom(1, 2)
	AddRoom(3, 4)
}

// Remove all records from the tables.
func ClearTables(db *gorm.DB) {
	cols := [1]string{"rooms"}
	for _, col := range cols {
		s := fmt.Sprintf("DROP TABLE IF EXISTS %s", col)
		db.Exec(s)
	}
}

func AddRoom(userAId uint, userBId uint) {
	room := models.Room{
		UserAId: userAId,
		UserBId: userBId,
	}

	DB.Create(&room)
}
