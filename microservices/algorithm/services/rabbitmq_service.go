package services

import (
	"encoding/json"
	"fmt"
	"log"
	db "proofster/algorithm/models/db"
	repositories "proofster/algorithm/repositories"

	amqp "github.com/rabbitmq/amqp091-go"
)

type Incoming struct {
	Data []struct {
		WorkspaceId string       `json:"workspace_id"`
		Formulas    []db.Formula `json:"formulas"`
	} `json:"data"`
}

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

	// to do, insert edited status to metadata
	log.Println("Listening for formulas...")
	go func() {
		for msg := range msgs {
			log.Printf(" > Received message: %s\n", msg.Body)

			incoming := Incoming{}
			err := json.Unmarshal([]byte(msg.Body), &incoming)
			if err != nil {
				log.Printf("errors occurred while unpacking json %s\n", err)
				continue
			}

			for _, data := range incoming.Data {
				err = repositories.SaveBulkFormulas(
					data.WorkspaceId,
					data.Formulas,
				)
				if err != nil {
					log.Printf("error saving formulas for workspace %s\n", err)
				}

				if len(data.Formulas) == 0 {
					err := repositories.DeleteMetadata(
						data.WorkspaceId,
					)
					if err != nil {
						log.Printf("error delete metadata %s\n", err)
					}
				} else {
					err := repositories.SaveMetadata(
						data.WorkspaceId,
						false,
						false,
						false,
					)
					if err != nil {
						log.Printf("error adding metadata %s\n", err)
					}
				}
			}
		}
	}()

	return nil
}
