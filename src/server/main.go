package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/VibeMerchants/StudyBuddies/config"
)

func main() {
	log.Println("Starting Server on port 8080")

	ctx := context.Background()

	// Load the configuration
	cfg, err := config.LoadConfig(ctx)

	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	data, err := NewData(ctx, cfg)

	if err != nil {
		log.Fatalf("Failed to create data: %v", err)
	}

	router, err := injectServices(data, cfg)

	if err != nil {
		log.Fatalf("Failed to inject services: %v", err)
	}

	srv := &http.Server{
		Addr:    ":8080",
		Handler: router,
	}

	go func() {
		if err := srv.ListenAndServe(); err != nil {
			log.Fatalf("Failed to start server: %v", err)
		}
	}() //Server should not block the main thread

	quitChan := make(chan os.Signal, 1)

	signal.Notify(quitChan, syscall.SIGINT, syscall.SIGTERM)

	// Blocks "quitChan" until a signal is received to quit
	<-quitChan

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	log.Println("Shutting server down")

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("Failed to shutdown server: %v", err)
	}

	select {
	case <-ctx.Done():
		log.Println("Server shutdown w/ timeout of 5s exceeded")
	}

	log.Println("Server shutdown gracefully")

}
