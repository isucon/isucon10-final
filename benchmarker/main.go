package main

import (
	"context"
	"flag"
	"fmt"
	"github.com/isucon/isucon10-final/benchmarker/story"
)

var (
	host = flag.String("host", "localhost:9292", "Target host")
)

func main() {
	flag.Parse()

	s, err := story.NewStory(*host)
	if err != nil {
		fmt.Println(err.Error())
		return
	}

	err = s.Run(context.TODO())
	if err != nil {
		fmt.Println(err.Error())
		return
	}

	for _, msg := range s.ErrorMessages() {
		fmt.Println(msg)
	}
	fmt.Printf("Score: %d\n", s.GetScore())
	fmt.Printf("Score: %s\n", s.Scores.String())
}
