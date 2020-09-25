package main

import (
	"context"
	"flag"
	"fmt"
	"net/http"
	"os"
	"runtime/pprof"
	"time"

	"github.com/isucon/isucandar"
	"github.com/isucon/isucandar/agent"
	"github.com/isucon/isucandar/failure"
	"github.com/isucon/isucon10-final/benchmarker/pushserver"
	"github.com/isucon/isucon10-final/benchmarker/scenario"
	"github.com/isucon/isucon10-portal/bench-tool.go/benchrun"
	isuxportalResources "github.com/isucon/isucon10-portal/proto.go/isuxportal/resources"
)

var (
	targetAddress      string
	profileFile        string
	hostAdvertise      string
	pushServerPort     int
	tlsCertificatePath string
	tlsKeyPath         string
	useTLS             bool
	exitStatusOnFail   bool

	reporter benchrun.Reporter
)

func init() {
	// Firefox はデフォルト300秒待つので
	agent.DefaultRequestTimeout = 300 * time.Second

	flag.StringVar(&targetAddress, "target", benchrun.GetTargetAddress(), "ex: localhost:9292")
	flag.StringVar(&profileFile, "profile", "", "ex: cpu.out")
	flag.StringVar(&hostAdvertise, "host-advertise", "local.t.isucon.dev", "hostname to advertise against target")
	flag.IntVar(&pushServerPort, "push-service-port", 11001, "port number to listen a push service")
	flag.StringVar(&tlsCertificatePath, "tls-cert", "../secrets/cert.pem", "path to TLS certificate for a push service")
	flag.StringVar(&tlsKeyPath, "tls-key", "../secrets/key.pem", "path to private key of TLS certificate for a push service")
	flag.BoolVar(&useTLS, "tls", false, "server is a tls (HTTPS & gRPC over h2)")
	flag.BoolVar(&exitStatusOnFail, "exit-status", false, "set exit status non-zero when a benchmark result is failing")

	flag.Parse()
}

func sendResult(s *scenario.Scenario, result *isucandar.BenchmarkResult, finish bool) bool {
	passed := true
	breakdown := result.Score.Breakdown()

	// 仮想競技者スコア
	result.Score.Set("finish-benchmark", 10)
	result.Score.Set("resolve-clarification", 10)
	result.Score.Set("get-dashboard", 2)
	contestantScore := result.Score.Sum()

	// 大会規模ボーナス
	contestants := int64(0)
	if n, ok := breakdown["create-team"]; ok {
		contestants += n
	}
	if n, ok := breakdown["join-member"]; ok {
		contestants += n
	}
	bonusMag := int64(10)
	if contestants >= 300 {
		bonusMag = 20
	} else if contestants >= 180 {
		bonusMag = 16
	} else if contestants >= 120 {
		bonusMag = 14
	} else if contestants >= 60 {
		bonusMag = 12
	}

	// 観客スコア
	audienceScore := int64(0)
	if n, ok := breakdown["audience-get-dashboard"]; ok {
		audienceScore = n / 10
	}

	deduction := int64(0)
	timeoutCount := int64(0)

	for _, err := range result.Errors.All() {
		if failure.IsCode(err, isucandar.ErrLoad) {
			if failure.IsCode(err, scenario.ErrInvalidResponse) ||
				failure.IsCode(err, scenario.ErrChecksum) ||
				failure.IsCode(err, scenario.ErrProtobuf) ||
				failure.IsCode(err, scenario.ErrX5XX) {
				deduction++
			} else if failure.IsCode(err, failure.TimeoutErrorCode) {
				timeoutCount++
			}
		}
	}

	if deduction > 100 {
		passed = false
	}

	scoreRaw := (contestantScore * bonusMag / 10) + audienceScore
	scoreDeduction := (deduction * 5) + (timeoutCount / 100)
	scoreTotal := scoreRaw - scoreDeduction
	if scoreTotal <= 0 {
		scoreTotal = 0
		passed = false
	}

	fmt.Printf("(%d * %d) + %d - %d(err: %d, timeout: %d)\n", contestantScore, bonusMag, audienceScore, scoreDeduction, deduction, timeoutCount)
	fmt.Printf("Pass: %v / score: %d (%d - %d)\n", passed, scoreTotal, scoreRaw, scoreDeduction)

	reporter.Report(&isuxportalResources.BenchmarkResult{
		SurveyResponse: &isuxportalResources.SurveyResponse{
			Language: s.Language,
		},
		Finished: finish,
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

	return passed
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

	pushServiceOrigin := fmt.Sprintf("https://%s", hostAdvertise)
	if pushServerPort != 443 {
		pushServiceOrigin = fmt.Sprintf("https://%s:%d", hostAdvertise, pushServerPort)
	}
	pushService := pushserver.NewService(pushServiceOrigin, 1000)
	go http.ListenAndServeTLS(fmt.Sprintf("0.0.0.0:%d", pushServerPort), tlsCertificatePath, tlsKeyPath, pushService.HTTP())

	s, err := scenario.NewScenario()
	scheme := "http"
	if useTLS {
		scheme = "https"
	}
	s.BaseURL = fmt.Sprintf("%s://%s/", scheme, targetAddress)
	s.UseTLS = useTLS
	s.PushService = pushService

	b, err := isucandar.NewBenchmark(isucandar.WithPrepareTimeout(20*time.Second), isucandar.WithLoadTimeout(65*time.Second))
	if err != nil {
		panic(err)
	}

	reporter, err = benchrun.NewReporter(false)
	if err != nil {
		panic(err)
	}

	b.OnError(func(err error, _ *isucandar.BenchmarkStep) {
		if failure.IsCode(err, failure.TimeoutErrorCode) {
			return
		}

		fmt.Printf("%v\n", err)
	})

	b.AddScenario(s)

	result := b.Start(ctx)
	errorMsgs := map[string]int{}
	for msg, count := range errorMsgs {
		fmt.Printf("%d: %s\n", count, msg)
	}
	fmt.Printf("%+v\n", result.Score.Breakdown())

	if !sendResult(s, result, true) && exitStatusOnFail {
		os.Exit(1)
	}
}
