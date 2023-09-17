package main

import (
	"log"
	"matching-service/config"
	"matching-service/handlers"
	"matching-service/utils"
	"net/http"

	"github.com/olahol/melody"
)

func main() {
	m := melody.New()
	setupHTTPHandlers(m)

	rabbitMqConn := handlers.CreateConnection()
	defer rabbitMqConn.Close()

	rabbitMqChannel := handlers.CreateChannel(rabbitMqConn)
	defer rabbitMqChannel.Close()

	queues := handlers.CreateQueues(rabbitMqChannel)
	go handlers.ConsumeMessages(rabbitMqChannel, queues)

	port := config.GetServicePort()
	log.Println(utils.MatchingServicePortLog + port)
	http.ListenAndServe(port, nil)
}

func setupHTTPHandlers(m *melody.Melody) {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte(utils.HelloMessage))
	})

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		m.HandleRequest(w, r)
	})

	m.HandleMessage(func(s *melody.Session, msg []byte) {
		res := handlers.HandleMessage(msg)
		s.Write(res)
	})
}
