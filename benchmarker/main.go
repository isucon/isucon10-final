package main

import (
	"context"
	"flag"
	"fmt"
	"time"

	"github.com/isucon/isucandar"
	"github.com/isucon/isucandar/failure"
	"github.com/isucon/isucon10-final/benchmarker/scenario"
	"github.com/isucon/isucon10-portal/bench-tool.go/benchrun"
	isuxportalResources "github.com/isucon/isucon10-portal/proto.go/isuxportal/resources"
)

var (
	targetAddress string = ""
)

func init() {
	flag.StringVar(&targetAddress, "target", benchrun.GetTargetAddress(), "ex: localhost:9292")

	flag.Parse()
}

func main() {
	if targetAddress == "" {
		targetAddress = "localhost:9292"
	}

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	s, err := scenario.NewScenario()
	s.BaseURL = fmt.Sprintf("http://%s/", targetAddress)

	b, err := isucandar.NewBenchmark(isucandar.WithPrepareTimeout(10*time.Second), isucandar.WithLoadTimeout(60*time.Second))
	if err != nil {
		panic(err)
	}
	reporter, err := benchrun.NewReporter(false)
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
	fmt.Printf("%+v\n", result.Score.Breakdown())

	passed := true
	scoreRaw := result.Score.Sum()
	scoreDeduction := int64(0)
	scoreTotal := scoreRaw - scoreDeduction
	if scoreTotal < 0 {
		scoreTotal = 0
		passed = false
	}

	reporter.Report(&isuxportalResources.BenchmarkResult{
		SurveyResponse: &isuxportalResources.SurveyResponse{
			Language: s.Language,
		},
		Finished: true,
		Passed:   passed,
		Score:    scoreTotal,
		ScoreBreakdown: &isuxportalResources.BenchmarkResult_ScoreBreakdown{
			Raw:       scoreRaw,
			Deduction: scoreDeduction,
		},
		Execution: &isuxportalResources.BenchmarkResult_Execution{
			Reason: fmt.Sprintf("%+v", result.Score.Breakdown()),
		},
	})
}
