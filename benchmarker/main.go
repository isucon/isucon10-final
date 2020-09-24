package main

import (
	"context"
	"flag"
	"fmt"
	"os"
	"runtime/pprof"
	"time"

	"github.com/isucon/isucandar"
	"github.com/isucon/isucandar/failure"
	"github.com/isucon/isucon10-final/benchmarker/scenario"
	"github.com/isucon/isucon10-portal/bench-tool.go/benchrun"
	isuxportalResources "github.com/isucon/isucon10-portal/proto.go/isuxportal/resources"
)

var (
	targetAddress string
	profileFile   string
	hostAdvertise string
	useTLS        bool
)

func init() {
	flag.StringVar(&targetAddress, "target", benchrun.GetTargetAddress(), "ex: localhost:9292")
	flag.StringVar(&profileFile, "profile", "", "ex: cpu.out")
	flag.StringVar(&hostAdvertise, "host-advertise", "localhost", "hostname to advertise against target")
	flag.BoolVar(&useTLS, "tls", false, "server is a tls (HTTPS & gRPC over h2)")

	flag.Parse()
}

func main() {
	if profileFile != "" {
		fs, err := os.Create(profileFile)
		if err != nil {
			panic(err)
		}
		pprof.StartCPUProfile(fs)
		defer pprof.StopCPUProfile()
	}
	if targetAddress == "" {
		targetAddress = "localhost:9292"
	}

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	s, err := scenario.NewScenario()
	scheme := "http"
	if useTLS {
		scheme = "https"
	}
	s.BaseURL = fmt.Sprintf("%s://%s/", scheme, targetAddress)
	s.UseTLS = useTLS
	s.HostAdvertise = hostAdvertise

	b, err := isucandar.NewBenchmark(isucandar.WithPrepareTimeout(20*time.Second), isucandar.WithLoadTimeout(60*time.Second))
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
