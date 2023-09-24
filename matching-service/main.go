package main

import (
	"log"
	"matching-service/config"
	"matching-service/handlers"
	"matching-service/utils"
	"net/http"

	"github.com/olahol/melody"
	"github.com/rabbitmq/amqp091-go"
)

func main() {

	rabbitMqConn := handlers.CreateConnection()
	defer rabbitMqConn.Close()

	rabbitMqChannel := handlers.CreateChannel(rabbitMqConn)
	defer rabbitMqChannel.Close()

	queues := handlers.CreateQueues(rabbitMqChannel)
	go handlers.ConsumeMessages(rabbitMqChannel, queues)

	m := melody.New()
	setupHTTPHandlers(m, rabbitMqChannel)

	port := config.GetServicePort()
	log.Println(utils.MatchingServicePortLog + port)
	http.ListenAndServe(port, nil)
}

func setupHTTPHandlers(m *melody.Melody, ch *amqp091.Channel) {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte(utils.HelloMessage))
	})

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		m.HandleRequest(w, r)
	})

	m.HandleMessage(func(s *melody.Session, msg []byte) {
		res := handlers.HandleMessage(msg, ch)
		s.Write(res)
	})
}
