package main

import (
	"context"
	"crypto/tls"
	"crypto/x509"
	"flag"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"runtime/pprof"
	"sort"
	"strings"
	"sync"
	"sync/atomic"
	"time"

	"github.com/isucon/isucandar/score"

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
		[]int64{240, 18},
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
	COMMIT             string
	targetAddress      string
	profileFile        string
	hostAdvertise      string
	pushServerPort     int
	tlsCertificatePath string
	tlsKeyPath         string
	useTLS             bool
	exitStatusOnFail   bool
	noLoad             bool
	noClar             bool
	promOut            string
	showVersion        bool

	reporter benchrun.Reporter
)

func init() {
	certs, err := x509.SystemCertPool()
	if err != nil {
		panic(err)
	}

	agent.DefaultTLSConfig.ClientCAs = certs
	agent.DefaultTLSConfig.ClientAuth = tls.RequireAndVerifyClientCert
	agent.DefaultTLSConfig.MinVersion = tls.VersionTLS12
	agent.DefaultTLSConfig.InsecureSkipVerify = false

	flag.StringVar(&targetAddress, "target", benchrun.GetTargetAddress(), "ex: localhost:9292")
	flag.StringVar(&profileFile, "profile", "", "ex: cpu.out")
	flag.StringVar(&hostAdvertise, "host-advertise", "local.t.isucon.dev", "hostname to advertise against target")
	flag.IntVar(&pushServerPort, "push-service-port", 11001, "port number to listen a push service")
	flag.StringVar(&tlsCertificatePath, "tls-cert", "../secrets/cert.pem", "path to TLS certificate for a push service")
	flag.StringVar(&tlsKeyPath, "tls-key", "../secrets/key.pem", "path to private key of TLS certificate for a push service")
	flag.BoolVar(&useTLS, "tls", false, "server is a tls (HTTPS & gRPC over h2)")
	flag.BoolVar(&exitStatusOnFail, "exit-status", false, "set exit status non-zero when a benchmark result is failing")
	flag.BoolVar(&noLoad, "no-load", false, "exit on finished prepare")
	flag.BoolVar(&noClar, "no-clar", false, "off sending clar")
	flag.StringVar(&promOut, "prom-out", "", "Prometheus textfile output path")
	flag.BoolVar(&showVersion, "version", false, "show version and exit 1")

	timeoutDuration := ""
	flag.StringVar(&timeoutDuration, "timeout", "10s", "request timeout duration")

	flag.Parse()

	timeout, err := time.ParseDuration(timeoutDuration)
	if err != nil {
		panic(err)
	}
	agent.DefaultRequestTimeout = timeout
}

func checkError(err error) (critical bool, timeout bool, deduction bool) {
	critical = false
	timeout = false
	deduction = false

	if failure.IsCode(err, scenario.ErrCritical) {
		critical = true
		return
	}

	if failure.IsCode(err, isucandar.ErrLoad) {
		if failure.IsCode(err, failure.TimeoutErrorCode) {
			timeout = true
			return
		} else if failure.IsCode(err, scenario.ErrInvalidResponse) ||
			failure.IsCode(err, scenario.ErrChecksum) ||
			failure.IsCode(err, scenario.ErrProtobuf) ||
			failure.IsCode(err, scenario.ErrWebPush) ||
			failure.IsCode(err, scenario.ErrHTTP) ||
			failure.IsCode(err, scenario.ErrBenchmarkerReceive) ||
			failure.IsCode(err, scenario.ErrBenchmarkerReport) ||
			failure.IsCode(err, scenario.ErrX400) ||
			failure.IsCode(err, scenario.ErrX401) ||
			failure.IsCode(err, scenario.ErrX402) ||
			failure.IsCode(err, scenario.ErrX403) ||
			failure.IsCode(err, scenario.ErrX404) ||
			failure.IsCode(err, scenario.ErrX503) ||
			failure.IsCode(err, scenario.ErrX5XX) {
			deduction = true
		}
	}

	return
}

func sendResult(s *scenario.Scenario, result *isucandar.BenchmarkResult, finish bool) bool {
	logger := scenario.ContestantLogger
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
		isCritical, isTimeout, isDeduction := checkError(err)

		switch true {
		case isCritical:
			passed = false
			reason = "Critical error"
		case isTimeout:
			timeoutCount++
		case isDeduction:
			deduction++
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

	promTags := []string{
		fmt.Sprintf("xsuconbench_score_total{} %d\n", scoreTotal),
		fmt.Sprintf("xsuconbench_score_raw{} %d\n", scoreRaw),
		fmt.Sprintf("xsuconbench_score_deduction{} %d\n", scoreDeduction),
		fmt.Sprintf("xsuconbench_score_subtotal{name=\"contestant\"} %d\n", contestantScore),
		fmt.Sprintf("xsuconbench_score_subtotal{name=\"bonusMag\"} %f\n", float64(bonusMag)/10),
		fmt.Sprintf("xsuconbench_score_subtotal{name=\"audienceScore\"} %d\n", audienceScore),
		fmt.Sprintf("xsuconbench_score_subtotal{name=\"scoreDeduction\"} %d\n", scoreDeduction),
		fmt.Sprintf("xsuconbench_score_error_count{name=\"deduction\"} %d\n", deduction),
		fmt.Sprintf("xsuconbench_score_error_count{name=\"timeout\"} %d\n", timeoutCount),
	}
	if passed {
		promTags = append(promTags, "xsuconbench_passed{} 1\n")
	} else {
		promTags = append(promTags, "xsuconbench_passed{} 0\n")
	}

	tags := []string{}
	for k, v := range breakdown {
		promTags = append(promTags, fmt.Sprintf("xsuconbench_score_breakdown{name=\"%s\"} %d\n", k, v))
		tags = append(tags, string(k))
	}
	sort.Strings(tags)

	for idx, tag := range tags {
		if v, ok := breakdown[score.ScoreTag(tag)]; ok {
			tags[idx] = fmt.Sprintf("  %s: %d", tag, v)
		} else {
			tags[idx] = fmt.Sprintf("  %s: %d", tag, 0)
		}
	}
	scoreTags := strings.Join(tags, "\n")

	writePromFile(promTags)

	if finish {
		logger.Printf("===> SCORE")
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

func writePromFile(promTags []string) {
	if len(promOut) == 0 {
		return
	}

	promOutNew := fmt.Sprintf("%s.new", promOut)
	err := ioutil.WriteFile(promOutNew, []byte(strings.Join(promTags, "")), 0644)
	if err != nil {
		scenario.AdminLogger.Printf("Failed to write prom file: %s", err)
		return
	}
	err = os.Rename(promOutNew, promOut)
	if err != nil {
		scenario.AdminLogger.Printf("Failed to write prom file: %s", err)
		return
	}

}

func main() {
	scenario.AdminLogger.Printf("ISUCON10 benchmarker %s", COMMIT)

	if showVersion {
		os.Exit(1)
	}

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
	go (func() {
		err := http.ListenAndServeTLS(fmt.Sprintf("0.0.0.0:%d", pushServerPort), tlsCertificatePath, tlsKeyPath, pushService.HTTP())
		if err != nil {
			panic(err)
		}
	})()

	s, err := scenario.NewScenario()
	scheme := "http"
	if useTLS {
		scheme = "https"
	}
	s.BaseURL = fmt.Sprintf("%s://%s/", scheme, targetAddress)
	s.UseTLS = useTLS
	s.PushService = pushService
	s.NoLoad = noLoad
	s.NoClar = noClar

	b, err := isucandar.NewBenchmark(isucandar.WithLoadTimeout(70 * time.Second))
	if err != nil {
		panic(err)
	}

	reporter, err = benchrun.NewReporter(false)
	if err != nil {
		panic(err)
	}

	errorCount := int64(0)
	b.OnError(func(err error, step *isucandar.BenchmarkStep) {
		// Load 中の timeout のみログから除外
		if failure.IsCode(err, failure.TimeoutErrorCode) && failure.IsCode(err, isucandar.ErrLoad) {
			return
		}

		critical, _, deduction := checkError(err)

		if critical || (deduction && atomic.AddInt64(&errorCount, 1) >= 100) {
			step.Cancel()
		}

		scenario.ContestantLogger.Printf("ERR: %v", err)
	})

	b.AddScenario(s)

	wg := sync.WaitGroup{}
	b.Load(func(ctx context.Context, step *isucandar.BenchmarkStep) error {
		if s.NoLoad {
			return nil
		}

		wg.Add(1)
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
