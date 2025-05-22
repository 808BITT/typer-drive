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

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		path := distDir + r.URL.Path
		info, err := os.Stat(path)
		if err == nil && !info.IsDir() {
			// File exists, serve it
			fs.ServeHTTP(w, r)
			return
		}
		// Fallback: serve index.html for SPA routing
		indexPath := distDir + "/index.html"
		http.ServeFile(w, r, indexPath)
	})

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
