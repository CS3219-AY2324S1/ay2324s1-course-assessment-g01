package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"matching-service/config"
	"matching-service/models"
	"matching-service/utils"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
)

// create RabbitMQ connection
func CreateConnection() *amqp.Connection {
	// RabbitMQ connection URL
	rabbitMQURL := config.GetRabbitMQConnString()

	// Connect to RabbitMQ
	conn, err := amqp.Dial(rabbitMQURL)
	if err != nil {
		// Sleep 10 seconds and try again
		time.Sleep(10 * time.Second)
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

func PublishMessage(ch *amqp.Channel, queueName string, userRequest models.User) {
	// marshal the message into a JSON object
	msgJson, _ := json.Marshal(userRequest)

	// Publish a message
	err := ch.PublishWithContext(
		context.TODO(),
		"",        // exchange
		queueName, // routing key
		false,     // mandatory
		false,     // immediate
		amqp.Publishing{
			ContentType: "application/json",
			Body:        msgJson,
		})
	if err != nil {
		log.Fatalf("%s: %v", utils.RabbitMQPublishError, err)
	} else {
		fmt.Printf("Sent %s message to queue %s\n", msgJson, queueName)
	}
}

func consumeMessage(ch *amqp.Channel, queueName string) {
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

	var current models.User
	current = models.User{}

	for msg := range msgs {
		// acknowledge the message
		fmt.Printf("Received a message: %s\n", msg.Body)
		msg.Ack(false)

		// marshal the message into a UserRequest object
		var userRequest models.User
		err = json.Unmarshal(msg.Body, &userRequest)
		if err != nil {
			log.Fatalf("%s: %v", utils.UnmarshalError, err)
		}

		if current.UserId == 0 {
			current = userRequest
		} else {
			// TODO replace with logic to match users
			fmt.Printf("Matched %d and %d\n", current.UserId, userRequest.UserId)
			current = models.User{}
		}
	}
}

func ConsumeMessages(ch *amqp.Channel, queues map[string]*amqp.Queue) {
	for queueName := range queues {
		go consumeMessage(ch, queueName)
	}
}
