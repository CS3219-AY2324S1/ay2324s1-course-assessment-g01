package database

import (
	"fmt"

	"gorm.io/gorm"
)

func AddMockData() {
	AddUser("abby@test.com", "abby123456", "abby", 1)
	AddUser("bob@test.com", "bob123456", "bob", 1)
	AddUser("cassie@test.com", "cassie123456", "cassie", 2)
	AddUser("david@test.com", "david123456", "david", 2)
	AddUser("emily@test.com", "emily123456", "emily", 3)
}

// Remove all records from the tables.
func ClearTables(db *gorm.DB) {
	cols := [1]string{"users"}
	for _, col := range cols {
		s := fmt.Sprintf("DROP TABLE IF EXISTS %s", col)
		db.Exec(s)
	}
}
