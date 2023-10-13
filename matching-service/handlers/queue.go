package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"matching-service/config"
	"matching-service/models"
	"matching-service/services"
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

func CreateDifficultyQueues(ch *amqp.Channel) map[string]*amqp.Queue {
	var queues map[string]*amqp.Queue = make(map[string]*amqp.Queue)

	queues[string(models.Easy)] = createQueue(string(models.Easy), ch)
	queues[string(models.Medium)] = createQueue(string(models.Medium), ch)
	queues[string(models.Hard)] = createQueue(string(models.Hard), ch)

	return queues
}

func CreateStopMatchQueue(ch *amqp.Channel) map[string]*amqp.Queue {
	var queues map[string]*amqp.Queue = make(map[string]*amqp.Queue)

	queues[string(models.StopMatch)] = createQueue(string(models.StopMatch), ch)

	return queues
}

func PublishMessage(ch *amqp.Channel, queueName string, userRequest models.User) {
	// marshal the message into a JSON object
	msgJson, _ := json.Marshal(userRequest)

	// Authenticate the request
	isAuthentic, auth_err := services.IsRequestAuthentic(userRequest)
	if auth_err != nil || !isAuthentic {
		fmt.Printf("%s: %v\n", utils.UserAuthError, auth_err)
		return
	}

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

func ConsumeMessage(ch *amqp.Channel, queueName string, s *utils.SocketStore) {
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

	var curStartUser models.User = models.User{}
	var roomsToUser map[uint]uint = make(map[uint]uint)

	for msg := range msgs {
		// acknowledge the message
		fmt.Printf("Received a message: %s\n", msg.Body)
		msg.Ack(false)

		// marshal the message into a User object
		var userRequest models.User
		err = json.Unmarshal(msg.Body, &userRequest)
		if err != nil {
			log.Fatalf("%s: %v", utils.UnmarshalError, err)
		}

		if userRequest.Action == models.StartMatch {
			handleMatchings(&curStartUser, userRequest, s)
		}

		if userRequest.Action == models.CancelMatch {
			handleCancelMatchings(&curStartUser, userRequest, s)
		}

		if userRequest.Action == models.StopMatch {
			handleUnmatchings(&roomsToUser,
				userRequest, s)
		}

	}
}

func handleCancelMatchings(
	curUser *models.User,
	parsedUser models.User,
	s *utils.SocketStore,
) {

	// check if current is empty
	if curUser.UserId == 0 {
		return
	}

	// check if the user ids match
	if curUser.UserId == parsedUser.UserId {

		// check if current exists in socket store and is open
		currentUserSocket, err := s.GetSocket(curUser.UserId)

		// if current user socket is closed, set current user to empty
		if err != nil || currentUserSocket.IsClosed() {
			return
		}
		curUserId := utils.ConvertToString(curUser.UserId)

		// send message to socket
		currentUserSocket.Write([]byte("cancel\n"))
		fmt.Printf("Removed %s from queue\n", curUserId)

		// delete socket from the store
		s.DeleteSocket(curUser.UserId)

		// reset current user
		*curUser = models.User{}

		return
	}
}

func handleMatchings(
	curUser *models.User,
	parsedUser models.User,
	s *utils.SocketStore,
) {

	// check if current is empty or if the user ids match
	if curUser.UserId == 0 || curUser.UserId == parsedUser.UserId {
		*curUser = parsedUser
	} else {
		// check if current exists in socket store and is open
		currentUserSocket, err := s.GetSocket(curUser.UserId)

		// if current user socket is closed, set current user to parsed user
		if err != nil || currentUserSocket.IsClosed() {
			*curUser = parsedUser
			return
		}

		// check if parsedUser exists in socket store and is open
		parsedUserSocket, err := s.GetSocket(parsedUser.UserId)

		// if parsed user socket is closed, do nothing
		if err != nil || parsedUserSocket.IsClosed() {
			return
		}

		// create room using collaboration service
		room, err := services.CreateRoom(curUser.UserId, parsedUser.UserId)
		if err != nil {
			fmt.Printf("%s: %v\n", utils.RoomCreationError, err)
			return
		}
		currentUserId := utils.ConvertToString(curUser.UserId)
		parsedUserId := utils.ConvertToString(parsedUser.UserId)
		roomId := utils.ConvertToString(room.RoomId)

		fmt.Printf("Matched %s and %s\n", currentUserId, parsedUserId)
		fmt.Printf("Room created with id %s\n", roomId)

		// send message to both sockets
		currentUserSocket.Write([]byte("matched_user:" + parsedUserId + "," + "room_id:" + roomId + "\n"))
		parsedUserSocket.Write([]byte("matched_user:" + currentUserId + "," + "room_id:" + roomId + "\n"))

		// delete both sockets from the store
		s.DeleteSocket(curUser.UserId)
		s.DeleteSocket(parsedUser.UserId)

		// reset current user
		*curUser = models.User{}
	}
}

func handleUnmatchings(
	roomsToUser *map[uint]uint,
	curUser models.User,
	s *utils.SocketStore,
) {

	hasAnotherUserInRoom := (*roomsToUser)[curUser.RoomId] != 0 && (*roomsToUser)[curUser.RoomId] != curUser.UserId

	if hasAnotherUserInRoom { // has another user who wants to stop matching
		otherUserId := (*roomsToUser)[curUser.RoomId]

		// check if other user exists in socket store and is open
		otherUserSocket, err := s.GetSocket(otherUserId)
		if err != nil || otherUserSocket.IsClosed() {
			return
		}

		// check if current user exists in socket store and is open
		currentUserSocket, err := s.GetSocket(curUser.UserId)
		if err != nil || currentUserSocket.IsClosed() {
			return
		}

		// update room as closed using collaboration service
		if services.CloseRoom(curUser.RoomId); err != nil {
			fmt.Printf("%s: %v\n", utils.RoomCloseError, err)
			return
		}

		currentUserIdStr := utils.ConvertToString(curUser.UserId)
		otherUserIdStr := utils.ConvertToString(otherUserId)

		fmt.Printf("Room %d closed for %s and %s\n", curUser.RoomId, currentUserIdStr, otherUserIdStr)

		// send message to both sockets
		currentUserSocket.Write([]byte("unmatched_user:" + otherUserIdStr + "\n"))
		otherUserSocket.Write([]byte("unmatched_user:" + currentUserIdStr + "\n"))

		// delete both sockets from the store
		s.DeleteSocket(curUser.UserId)
		s.DeleteSocket(otherUserId)

		// delete room from map
		delete(*roomsToUser, curUser.RoomId)

	} else {
		// add current user to room
		(*roomsToUser)[curUser.RoomId] = curUser.UserId
	}

}
func ConsumeMessages(ch *amqp.Channel, queues map[string]*amqp.Queue, s *utils.SocketStore) {
	for queueName := range queues {
		// create a goroutine for each queue
		go ConsumeMessage(ch, queueName, s)
	}
}
