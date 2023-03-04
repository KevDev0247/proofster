package main

import (
	"fmt"
	"net/http"
)

func main() {
	// Define a handler function for the API endpoint
	http.HandleFunc("/hello", func(w http.ResponseWriter, r *http.Request) {
		// Write a response back to the client
		fmt.Fprint(w, "Hello, World!")
	})

	// Start the HTTP server on port 8080
	if err := http.ListenAndServe(":8080", nil); err != nil {
		panic(err)
	}
}
