package main

import (
	"context"
	"flag"
	"fmt"
	"net/http"
	"os"
	"runtime/pprof"
	"strings"
	"sync"
	"time"

	"github.com/isucon/isucandar"
	"github.com/isucon/isucandar/agent"
	"github.com/isucon/isucandar/failure"
	"github.com/isucon/isucon10-final/benchmarker/pushserver"
	"github.com/isucon/isucon10-final/benchmarker/scenario"
	"github.com/isucon/isucon10-portal/bench-tool.go/benchrun"
	isuxportalResources "github.com/isucon/isucon10-portal/proto.go/isuxportal/resources"
)

// 点数調整用定数
var (
	// 回数に対して n 倍
	SCORE_BENCHMARK_FINISH int64 = 10
	// 回数に対して n 倍
	SCORE_CLARIFICATION_SEEN int64 = 10
	// 回数に対して n 倍
	SCORE_SHOW_DASHBOARD int64 = 2

	// 回数に対して 1/n
	SCORE_AUDIENCE_SHOW_DASHBOARD int64 = 10

	// 閾値を超えたら N 倍して / 10
	BONUS = [][]int64{
		[]int64{300, 20},
		[]int64{180, 16},
		[]int64{120, 14},
		[]int64{60, 12},
	}

	// エラーによる減点
	DEDUCTION_ERROR int64 = 50
	// タイムアウトによる減点
	DEDUCTION_TIMEOUT int64 = 100
	// FAIL になるエラー回数
	FAIL_ERROR_COUNT int64 = 100
	// タイムアウトの減点回数
	TIMEOUT_COUNT int64 = 100
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
	// リクエストは基本的に 5 秒
	agent.DefaultRequestTimeout = 5 * time.Second

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
	reason := ""
	errors := result.Errors.All()
	breakdown := result.Score.Breakdown()

	// 仮想競技者スコア
	result.Score.Set("finish-benchmark", SCORE_BENCHMARK_FINISH)
	result.Score.Set("resolve-clarification", SCORE_CLARIFICATION_SEEN)
	result.Score.Set("get-dashboard", SCORE_SHOW_DASHBOARD)
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
	for _, bonus := range BONUS {
		threshhold := bonus[0]
		mag := bonus[1]
		if contestants >= threshhold {
			bonusMag = mag
			break
		}
	}

	// 観客スコア
	audienceScore := int64(0)
	if n, ok := breakdown["audience-get-dashboard"]; ok {
		audienceScore = n / SCORE_AUDIENCE_SHOW_DASHBOARD
	}

	deduction := int64(0)
	timeoutCount := int64(0)

	for _, err := range errors {
		if failure.IsCode(err, scenario.ErrCritical) {
			passed = false
			reason = "Critical error"
			continue
		}

		if failure.IsCode(err, isucandar.ErrLoad) {
			if failure.IsCode(err, failure.TimeoutErrorCode) {
				timeoutCount++
			} else if failure.IsCode(err, scenario.ErrInvalidResponse) ||
				failure.IsCode(err, scenario.ErrChecksum) ||
				failure.IsCode(err, scenario.ErrProtobuf) ||
				failure.IsCode(err, scenario.ErrWebPush) ||
				failure.IsCode(err, scenario.ErrHTTP) ||
				failure.IsCode(err, scenario.ErrBenchmarkerReceive) ||
				failure.IsCode(err, scenario.ErrBenchmarkerReport) ||
				failure.IsCode(err, scenario.ErrX5XX) {
				deduction++
			}
		}
	}

	if passed && deduction > FAIL_ERROR_COUNT {
		passed = false
		reason = fmt.Sprintf("Error count over %d", FAIL_ERROR_COUNT)
	}

	scoreRaw := (contestantScore * bonusMag / 10) + audienceScore
	scoreDeduction := (deduction * DEDUCTION_ERROR)
	if timeoutCount >= TIMEOUT_COUNT {
		scoreDeduction += (timeoutCount / TIMEOUT_COUNT) * DEDUCTION_TIMEOUT
	}
	scoreTotal := scoreRaw - scoreDeduction
	if scoreTotal <= 0 {
		scoreTotal = 0
		if passed {
			passed = false
			reason = "Score"
		}
	}

	tags := []string{}
	for k, v := range breakdown {
		tags = append(tags, fmt.Sprintf("  %s: %d", k, v))
	}
	scoreTags := strings.Join(tags, "\n")

	if finish {
		fmt.Printf("Count: \n%s\n", scoreTags)
		fmt.Printf("(%d * %.1f) + %d - %d(err: %d, timeout: %d)\n", contestantScore, float64(bonusMag)/10, audienceScore, scoreDeduction, deduction, timeoutCount)
		fmt.Printf("Pass: %v / score: %d (%d - %d)\n", passed, scoreTotal, scoreRaw, scoreDeduction)
		if !passed {
			fmt.Printf("Fail reason: %s\n", reason)
		}
	}
	reason = scoreTags

	err := reporter.Report(&isuxportalResources.BenchmarkResult{
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
			Reason: reason,
		},
	})
	if err != nil {
		panic(err)
	}

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

	b.OnError(func(err error, step *isucandar.BenchmarkStep) {
		if failure.IsCode(err, failure.TimeoutErrorCode) {
			return
		}

		if failure.IsCode(err, scenario.ErrCritical) {
			step.Cancel()
		}

		fmt.Printf("%v\n", err)
	})

	b.AddScenario(s)

	wg := sync.WaitGroup{}
	wg.Add(1)
	b.Load(func(ctx context.Context, step *isucandar.BenchmarkStep) error {
		defer wg.Done()

		for {
			timer := time.After(3 * time.Second)
			sendResult(s, step.Result(), false)

			select {
			case <-timer:
			case <-ctx.Done():
				return nil
			}
		}
	})

	result := b.Start(ctx)

	wg.Wait()

	if !sendResult(s, result, true) && exitStatusOnFail {
		os.Exit(1)
	}
}
