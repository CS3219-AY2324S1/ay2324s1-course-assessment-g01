package utils

import (
	"context"
	"errors"
	"time"

	"github.com/olahol/melody"
)

// SocketStore is a custom data structure that includes the socket map
type SocketStore struct {
	SocketMap map[uint]*melody.Session
}

// NewSocketStore creates a new SocketStore instance
func NewSocketStore() *SocketStore {
	return &SocketStore{
		SocketMap: make(map[uint]*melody.Session),
	}
}

// GetSocket gets a socket from the map
func (s *SocketStore) GetSocket(key uint) (*melody.Session, error) {
	// Check if the key exists
	if val, ok := s.SocketMap[key]; ok {
		return val, nil
	}
	return nil, errors.New("key does not exist")
}

// SetSocket sets a socket in the map
func (s *SocketStore) SetSocket(key uint, value *melody.Session) {
	s.SocketMap[key] = value

	// set a timer to delete the value in 5 minutes
	_, cancel := context.WithCancel(context.Background())
	time.AfterFunc(5*time.Minute, func() {
		// delete the value if it exists
		if _, ok := s.SocketMap[key]; ok {
			delete(s.SocketMap, key)
		}
		// cancel the timer
		cancel()
	})
}

// DeleteSocket deletes a socket from the map
func (s *SocketStore) DeleteSocket(key uint) {
	delete(s.SocketMap, key)
}
