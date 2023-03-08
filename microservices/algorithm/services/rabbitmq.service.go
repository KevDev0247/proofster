package services

import (
	"fmt"
	"log"

	amqp "github.com/rabbitmq/amqp091-go"
)

func InitRabbitMQ(uri string) (*amqp.Connection, *amqp.Channel, error) {
	conn, err := amqp.Dial(uri)
	if err != nil {
		return nil, nil, fmt.Errorf("failed to connect to RabbitMQ: %w", err)
	}

	ch, err := conn.Channel()
	if err != nil {
		return nil, nil, fmt.Errorf("failed to open a channel: %w", err)
	}

	log.Println("Connected to RabbitMQ!")

	return conn, ch, nil
}

func ListenForFormulas(
	conn *amqp.Connection,
	ch *amqp.Channel,
) error {
	// Declare a queue
	q, err := ch.QueueDeclare(
		"formulas", // name
		true,       // durable
		false,      // delete when unused
		false,      // exclusive
		false,      // no-wait
		nil,        // arguments
	)
	if err != nil {
		return err
	}

	// Declare an exchange
	err = ch.ExchangeDeclare(
		"formulas", // name
		"fanout",   // type
		true,       // durable
		false,      // auto-deleted
		false,      // internal
		false,      // no-wait
		nil,        // arguments
	)
	if err != nil {
		return err
	}

	// Bind the queue to the exchange
	err = ch.QueueBind(
		q.Name,     // queue name
		"",         // routing key
		"formulas", // exchange
		false,
		nil,
	)
	if err != nil {
		return err
	}

	// Consume messages from the queue
	msgs, err := ch.Consume(
		q.Name, // queue
		"",     // consumer
		true,   // auto-ack
		false,  // exclusive
		false,  // no-local
		false,  // no-wait
		nil,    // args
	)
	if err != nil {
		return err
	}

	log.Println("Listening for formulas...")
	go func() {
		for msg := range msgs {
			// For example, show received message in a console.
			log.Printf(" > Received message: %s\n", msg.Body)
		}
	}()

	// go func() {
	// 	for d := range msgs {
	// 		var formulas []Formula
	// 		if err := json.Unmarshal(d.Body, &formulas); err != nil {
	// 			log.Printf("Failed to unmarshal message: %v", err)
	// 			continue
	// 		}
	// 		log.Printf("Received formulas: %v", formulas)
	// 		formulaService.UpdateFormulas(formulas)
	// 	}
	// }()

	return nil
}
