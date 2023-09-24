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

	// create RabbitMQ connection
	rabbitMqConn := handlers.CreateConnection()
	defer rabbitMqConn.Close()

	// create RabbitMQ channel
	rabbitMqChannel := handlers.CreateChannel(rabbitMqConn)
	defer rabbitMqChannel.Close()

	// create map of sockets
	socketStore := utils.NewSocketStore()

	// create queues for each difficulty
	queues := handlers.CreateQueues(rabbitMqChannel)
	go handlers.ConsumeMessages(rabbitMqChannel, queues, socketStore)

	// create a melody instance
	m := melody.New()
	setupHTTPHandlers(m, rabbitMqChannel, socketStore)

	// start the server
	port := config.GetMatchingServicePort()
	log.Println(utils.MatchingServicePortLog + port)
	http.ListenAndServe(port, nil)
}

func setupHTTPHandlers(m *melody.Melody, ch *amqp091.Channel, store *utils.SocketStore) {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte(utils.HelloMessage))
	})

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		m.HandleRequest(w, r)
	})

	m.HandleMessage(func(s *melody.Session, msg []byte) {
		res := handlers.HandleMessage(msg, ch, store, s)
		s.Write(res)
	})
}
