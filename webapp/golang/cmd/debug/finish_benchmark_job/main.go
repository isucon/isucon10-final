package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"math/rand"
	"os"
	"time"

	"google.golang.org/grpc"
	"google.golang.org/protobuf/types/known/timestamppb"

	"github.com/isucon/isucon10-final/webapp/golang/proto/xsuportal/resources"
	"github.com/isucon/isucon10-final/webapp/golang/proto/xsuportal/services/bench"
)

func main() {
	log.SetFlags(0)
	log.SetPrefix("finish_benchmark_job: ")
	if err := run(); err != nil {
		log.Fatal(err)
	}
}

func run() error {
	rand.Seed(time.Now().Unix())
	var flags struct {
		TeamID int64
		Host   string
	}
	flag.Int64Var(&flags.TeamID, "t", 0, "team id (required)")
	flag.StringVar(&flags.Host, "h", "localhost:50051", "benchmarker server host")
	flag.Parse()

	if flags.TeamID == 0 {
		flag.Usage()
		os.Exit(2)
	}

	cc, err := grpc.Dial(flags.Host, grpc.WithInsecure())
	if err != nil {
		return fmt.Errorf("dial grpc: %w", err)
	}
	defer cc.Close()

	ctx := context.TODO()

	receiver := bench.NewBenchmarkQueueClient(cc)
	resp, err := receiver.ReceiveBenchmarkJob(ctx, &bench.ReceiveBenchmarkJobRequest{
		TeamId: flags.TeamID,
	})
	if err != nil {
		return fmt.Errorf("receive benchmark job: %w", err)
	}
	jobHandle := resp.JobHandle
	if jobHandle == nil {
		log.Print("Job not found")
		return nil
	}
	log.Printf("Received a job: job_id=%v", jobHandle.JobId)

	reporter := bench.NewBenchmarkReportClient(cc)

	client, err := reporter.ReportBenchmarkResult(ctx)
	if err != nil {
		return fmt.Errorf("benchmark result stream: %w", err)
	}
	nonce := rand.Int63n(10000)
	err = client.Send(&bench.ReportBenchmarkResultRequest{
		JobId:  jobHandle.JobId,
		Handle: jobHandle.Handle,
		Nonce:  nonce,
		Result: &resources.BenchmarkResult{
			Finished: false,
			MarkedAt: timestamppb.New(time.Now().UTC()),
		},
	})
	if err != nil {
		return fmt.Errorf("send first benchmark result: %w", err)
	}
	ack1, err := client.Recv()
	if err != nil {
		return fmt.Errorf("receive first ack: %w", err)
	}
	if ack1.AckedNonce != nonce {
		return fmt.Errorf("unexpected acked_nonce(expected=%v, got=%v)", nonce, ack1.AckedNonce)
	}

	log.Printf("Reported as running: job_id=%v", jobHandle.JobId)

	scoreRaw := rand.Int63n(30000)
	scoreDeduction := rand.Int63n(2000) - 1800
	if scoreDeduction < 0 {
		scoreDeduction = 0
	}
	score := scoreRaw - scoreDeduction
	if score < 0 {
		score = 0
	}

	err = client.Send(&bench.ReportBenchmarkResultRequest{
		JobId:  jobHandle.JobId,
		Handle: jobHandle.Handle,
		Nonce:  nonce + 1,
		Result: &resources.BenchmarkResult{
			Finished: true,
			Passed:   true,
			Score:    score,
			ScoreBreakdown: &resources.BenchmarkResult_ScoreBreakdown{
				Raw:       scoreRaw,
				Deduction: scoreDeduction,
			},
			Reason:   "OK",
			MarkedAt: timestamppb.New(time.Now().UTC()),
		},
	})
	if err != nil {
		return fmt.Errorf("send second benchmark result: %w", err)
	}
	ack2, err := client.Recv()
	if err != nil {
		return fmt.Errorf("receive second ack: %w", err)
	}
	if ack2.AckedNonce != nonce+1 {
		return fmt.Errorf("unexpected acked_nonce(expected=%v, got=%v)", nonce+1, ack2.AckedNonce)
	}
	log.Printf("Reported as finished: job_id=%v", jobHandle.JobId)
	return nil
}
