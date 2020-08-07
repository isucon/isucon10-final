package main

import (
	"github.com/isucon/isucon10-final/bench/session"
)

func main() {
	s, _ := session.New("http://localhost:9292/")
	s.Get("/favicon.ico")
}
