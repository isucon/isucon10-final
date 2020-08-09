package session

import (
	"context"
	"errors"
	"fmt"
	"github.com/isucon/isucon10-final/benchmarker/model"
	"github.com/isucon/isucon10-final/proto/xsuportal/resources"
	"github.com/isucon/isucon10-final/proto/xsuportal/services/bench"
	"google.golang.org/grpc"
	"time"
)

type Benchmarker struct {
	conn         *grpc.ClientConn
	queueClinet  bench.BenchmarkQueueClient
	reportClient bench.BenchmarkReportClient

	Team *model.Team
}

func NewBenchmarker(team *model.Team, host string, port int64) (*Benchmarker, error) {
	host = fmt.Sprintf("%s:%d", host, port)

	conn, err := grpc.Dial(host, grpc.WithInsecure())
	if err != nil {
		return nil, err
	}

	return &Benchmarker{
		conn:         conn,
		queueClinet:  bench.NewBenchmarkQueueClient(conn),
		reportClient: bench.NewBenchmarkReportClient(conn),
		Team:         team,
	}, nil
}

func (b *Benchmarker) Do(ctx context.Context) error {
	jobResponse, err := b.queueClinet.ReceiveBenchmarkJob(ctx, &bench.ReceiveBenchmarkJobRequest{
		TeamId: b.Team.ID,
	})

	if err != nil {
		return err
	}

	jobHandle := jobResponse.GetJobHandle()
	if jobHandle == nil {
		return nil
	}

	reporter, err := b.reportClient.ReportBenchmarkResult(ctx)
	if err != nil {
		return err
	}

	reporter.Send(&bench.ReportBenchmarkResultRequest{
		JobId: jobHandle.GetJobId(),
		Result: &resources.BenchmarkResult{
			Finished: false,
			Score:    10,
			ScoreBreakdown: &resources.BenchmarkResult_ScoreBreakdown{
				Base:      10,
				Deduction: 0,
			},
			Reason: "REASON",
			Stdout: "",
			Stderr: "",
		},
		Nonce: 1,
	})
	reportResponse, err := reporter.Recv()
	if err != nil {
		return err
	}
	if reportResponse.AckedNonce != 1 {
		return errors.New("Invalid Nonce")
	}

	time.Sleep(1 * time.Second)

	reporter.Send(&bench.ReportBenchmarkResultRequest{
		JobId: jobHandle.GetJobId(),
		Result: &resources.BenchmarkResult{
			Finished: true,
			Passed:   true,
			Score:    100,
			ScoreBreakdown: &resources.BenchmarkResult_ScoreBreakdown{
				Base:      100,
				Deduction: 10,
			},
			Reason: "REASON",
			Stdout: "",
			Stderr: "",
		},
		Nonce: 2,
	})
	reporter.CloseSend()

	reportResponse, err = reporter.Recv()
	if err != nil {
		return err
	}
	if reportResponse.AckedNonce != 2 {
		return errors.New("Invalid Nonce")
	}

	return nil
}
