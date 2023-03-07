package main

import (
	"context"
	"proofster/algorithm/routes"
	"proofster/algorithm/services"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"
)

func main() {
	services.LoadConfig()
	services.InitMongoDB()

	if services.Config.UseRedis {
		services.CheckRedisConnection()
	}

	// Initialize RabbitMQ
	conn, ch, err := services.InitRabbitMQ(services.Config.RabbitMQUri)
	if err != nil {
		log.Fatalf("failed to initialize RabbitMQ: %v", err)
	}
	defer conn.Close()
	defer ch.Close()

	// Start listening for messages
	if err := services.ListenForFormulas(conn, ch); err != nil {
		log.Fatalf("failed to listen for formulas: %v", err)
	}

	routes.InitGin()
	router := routes.New()

	server := &http.Server{
		Addr:         services.Config.ServerAddr + ":" + services.Config.ServerPort,
		WriteTimeout: time.Second * 30,
		ReadTimeout:  time.Second * 30,
		IdleTimeout:  time.Second * 30,
		Handler:      router,
	}

	go func() {
		if err := server.ListenAndServe(); err != nil {
			log.Printf("listen: %s\n", err)
		}
	}()

	// Wait for interrupt signal to gracefully shut down the server with
	// a timeout of 15 seconds.
	quit := make(chan os.Signal)
	signal.Notify(quit, os.Interrupt)
	<-quit
	log.Println("Shutdown Server ...")

	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()
	if err := server.Shutdown(ctx); err != nil {
		log.Fatal("Server Shutdown:", err)
	}
	log.Println("Server exiting")
}
