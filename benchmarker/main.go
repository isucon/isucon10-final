package main

import (
	"github.com/isucon/isucon10-final/benchmarker/session"
)

func main() {
	s, _ := session.New("http://localhost:9292/")
	s.Post("/initialize", "text/plain", nil)
}
