package main

import (
	"context"
	"fmt"
	"github.com/isucon/isucon10-final/benchmarker/story"
)

func main() {
	s, err := story.NewStory("localhost:9292")
	if err != nil {
		fmt.Println(err.Error())
		return
	}

	err = s.Main(context.TODO())
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
