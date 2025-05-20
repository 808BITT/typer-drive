package main

import (
	"log"
	"net/http"
	"os"
)

func main() {
	// Serve static files from the built client
	distDir := "./client/dist"
	fs := http.FileServer(http.Dir(distDir))
	http.Handle("/", fs)

	// Determine port
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Serving %s on HTTP port: %s\n", distDir, port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatal(err)
	}
}
