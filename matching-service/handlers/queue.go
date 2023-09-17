package handlers

import (
	"context"
	"encoding/json"
	"log"
	"matching-service/config"
	"matching-service/models"
	"matching-service/utils"

	amqp "github.com/rabbitmq/amqp091-go"
)

// create RabbitMQ connection
func CreateConnection() *amqp.Connection {
	// RabbitMQ connection URL
	rabbitMQURL := config.GetRabbitMQConnString()

	// Connect to RabbitMQ
	conn, err := amqp.Dial(rabbitMQURL)
	if err != nil {
		log.Fatalf("%s: %v", utils.RabbitMQConnectionError, err)
	}
	return conn
}

func CreateChannel(conn *amqp.Connection) *amqp.Channel {
	// Create a channel
	ch, err := conn.Channel()
	if err != nil {
		log.Fatalf("%s: %v", utils.RabbitMQChannelError, err)
	}
	return ch
}

func createQueue(name string, ch *amqp.Channel) *amqp.Queue {
	// Declare a queue
	q, err := ch.QueueDeclare(
		name,  // name
		false, // durable
		false, // delete when unused
		false, // exclusive
		false, // no-wait
		nil,   // arguments
	)
	if err != nil {
		log.Fatalf("%s: %v", utils.RabbitMQQueueError, err)
	}
	return &q
}

func CreateQueues(ch *amqp.Channel) map[string]*amqp.Queue {
	var queues map[string]*amqp.Queue = make(map[string]*amqp.Queue)

	// create queues
	queues[string(models.Easy)] = createQueue(string(models.Easy), ch)
	queues[string(models.Medium)] = createQueue(string(models.Medium), ch)
	queues[string(models.Hard)] = createQueue(string(models.Hard), ch)

	return queues
}

func PublishMessage(ch *amqp.Channel, queueName string, msg []byte) {
	// Publish a message
	err := ch.PublishWithContext(
		context.TODO(),
		"",        // exchange
		queueName, // routing key
		false,     // mandatory
		false,     // immediate
		amqp.Publishing{
			ContentType: "text/plain",
			Body:        msg,
		})
	if err != nil {
		log.Fatalf("%s: %v", utils.RabbitMQPublishError, err)
	}
}

func consumeMessage(ch *amqp.Channel, queueName string) *models.UserRequest {
	msgs, err := ch.Consume(
		queueName,
		"",    // consumer/leave empty for auto-generated
		false, // auto-ack
		false, // exclusive
		false, // no-local
		false, // no-wait
		nil,   // args
	)
	if err != nil {
		log.Fatalf("%s: %v", utils.RabbitMQConsumeError, err)
	}

	// consume one message at a time
	msg := <-msgs

	// acknowledge the message
	msg.Ack(false)

	// marshal the message into a UserRequest object
	var userRequest models.UserRequest
	err = json.Unmarshal(msg.Body, &userRequest)
	if err != nil {
		log.Fatalf("%s: %v", utils.UnmarshalError, err)
	}

	return &userRequest
}

func ConsumeMessages(ch *amqp.Channel, queues map[string]*amqp.Queue) {
	// check for messages in each queue
	var messages map[string]*models.UserRequest = make(map[string]*models.UserRequest)

	for queueName := range queues {
		message := consumeMessage(ch, queueName)
		if messages[string(message.Difficulty)] != nil {
			// TODO replace with logic to match users
			messages[string(message.Difficulty)] = message
		}
	}

	// run infinitely
	loop := make(chan bool)
	<-loop
}
