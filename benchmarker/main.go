package main

import (
	"context"
	"fmt"
	"time"

	"github.com/isucon/isucon10-final/benchmarker/scenario"
	"github.com/rosylilly/isucandar"
	"github.com/rosylilly/isucandar/failure"
)

func main() {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	s, err := scenario.NewScenario()
	s.BaseURL = "http://localhost:9292/"

	b, err := isucandar.NewBenchmark(isucandar.WithPrepareTimeout(10*time.Second), isucandar.WithLoadTimeout(60*time.Second))
	if err != nil {
		panic(err)
	}

	b.AddScenario(s)

	result := b.Start(ctx)
	errorMsgs := map[string]int{}
	for _, err := range result.Errors.All() {
		if failure.IsCode(err, failure.TimeoutErrorCode) || failure.IsCode(err, failure.TemporaryErrorCode) {
			continue
		}

		msg := fmt.Sprintf("%v", err)
		if _, ok := errorMsgs[msg]; ok {
			errorMsgs[msg]++
		} else {
			errorMsgs[msg] = 1
			fmt.Printf("%+v\n", err)
		}
	}
	for msg, count := range errorMsgs {
		fmt.Printf("%d: %s\n", count, msg)
	}
	fmt.Println(result.Score.Breakdown())
}
