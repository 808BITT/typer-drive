# Go Static Server Setup

Create an HTTP server in Go to serve files from `./dist`.

- **Inputs:** None
- **Desired Output:**
  - A `main.go` that reads `PORT` env var (default 8080)
  - Uses `http.FileServer` for `./dist`
  - Proper logging and error handling
