package database

import (
	"fmt"

	"gorm.io/gorm"
)

func AddMockData(db *gorm.DB) {
	AddUser(db, "abby@test.com", "abby123456", "abby", 1)
	AddUser(db, "bob@test.com", "bob123456", "bob", 1)
	AddUser(db, "cassie@test.com", "cassie123456", "cassie", 2)
	AddUser(db, "david@test.com", "david123456", "david", 2)
	AddUser(db, "emily@test.com", "emily123456", "emily", 3)
}

// Remove all records from the tables.
func ClearTables(db *gorm.DB) {
	cols := [1]string{"users"}
	for _, col := range cols {
		s := fmt.Sprintf("DROP TABLE IF EXISTS %s", col)
		db.Exec(s)
	}
}
