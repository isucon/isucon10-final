package scenario

import (
	"context"
	"fmt"
	"math/rand"
	"strconv"
	"sync/atomic"
	"time"

	"github.com/golang/protobuf/ptypes"

	"github.com/isucon/isucandar"
	"github.com/isucon/isucandar/failure"
	"github.com/isucon/isucon10-final/benchmarker/model"
	"github.com/isucon/isucon10-final/benchmarker/proto/xsuportal/resources"
	"github.com/isucon/isucon10-final/benchmarker/proto/xsuportal/services/bench"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/credentials"
)

var (
	ErrBenchmarkerReceive failure.StringCode = "benchmarker-receive"
	ErrBenchmarkerReport  failure.StringCode = "benchmarker-report"
	ErrBenchmarkerPanic   failure.StringCode = "benchmarker-panic"
)

type Benchmarker struct {
	Scenario *Scenario
	GRPCHost string
	GRPCPort int64
	UseTLS   bool
	TeamID   int64
}

func (s *Scenario) NewBenchmarker(id int64) *Benchmarker {
	return &Benchmarker{
		Scenario: s,
		GRPCHost: s.Contest.GRPCHost,
		GRPCPort: s.Contest.GRPCPort,
		UseTLS:   s.UseTLS,
		TeamID:   id,
	}
}

func (b *Benchmarker) Process(ctx context.Context, step *isucandar.BenchmarkStep) error {
	// recover は邪悪な文明
	// defer func() {
	// 	err := recover()
	// 	if perr, ok := err.(error); ok {
	// 		step.AddError(failure.NewError(ErrBenchmarkerPanic, perr))
	// 	}
	// }()
	ctx, cancel := context.WithCancel(ctx)
	defer cancel()

	conn, err := b.dial()
	if err != nil {
		return failure.NewError(ErrScenarioCretical, err)
	}
	defer conn.Close()

	queue := bench.NewBenchmarkQueueClient(conn)
	report := bench.NewBenchmarkReportClient(conn)

	retry := int32(10)
	for ctx.Err() == nil {
		func() {
			// recover は邪悪な文明
			// defer func() {
			// 	err := recover()
			// 	if perr, ok := err.(error); ok {
			// 		step.AddError(failure.NewError(ErrBenchmarkerPanic, perr))
			// 	}
			// }()

			job, err := b.receiveBenchmarkJob(ctx, queue)
			if err != nil {
				errCode := grpc.Code(err)
				if errCode == codes.Unavailable {
					if atomic.LoadInt32(&retry) > 0 {
						atomic.AddInt32(&retry, -1)
						<-time.After(1 * time.Second)
						return
					} else {
						cancel()
					}
				}
				if errCode != codes.DeadlineExceeded && errCode != codes.Canceled {
					step.AddError(failure.NewError(ErrBenchmarkerReceive, err))
				}
				return
			}
			atomic.StoreInt32(&retry, 0)

			jobHandle := job.GetJobHandle()
			if jobHandle == nil {
				return
			}

			host := jobHandle.GetTargetHostname()
			teamID := 0
			if len(host) > 16 {
				teamID, _ = strconv.Atoi(host[15:])
			}
			team := b.Scenario.Contest.GetTeam(int64(teamID))
			if team == nil {
				step.AddError(failure.NewError(ErrBenchmarkerReceive, fmt.Errorf("Unknown team: %d", jobHandle.GetJobId())))
				return
			}

			reporter, err := report.ReportBenchmarkResult(ctx)
			if err != nil {
				errCode := grpc.Code(err)
				if errCode != codes.DeadlineExceeded && errCode != codes.Canceled {
					step.AddError(failure.NewError(ErrBenchmarkerReceive, err))
				}
				return
			}

			bResult := team.GetQueuedBenckmarkResult()
			// たまに状態更新し終わる前にここに来てしまうので取れるまで待つ
			for bResult == nil {
				<-time.After(10 * time.Millisecond)
				bResult = team.GetQueuedBenckmarkResult()
			}

			bResult.Mark(time.Now().UTC())
			result := b.generateFirstReport(jobHandle, bResult)
			err = reporter.Send(result)
			if err != nil {
				errCode := grpc.Code(err)
				if errCode != codes.DeadlineExceeded && errCode != codes.Canceled {
					step.AddError(failure.NewError(ErrBenchmarkerReceive, err))
				}
				return
			}
			res, err := reporter.Recv()
			if err != nil {
				errCode := grpc.Code(err)
				if errCode != codes.DeadlineExceeded && errCode != codes.Canceled {
					step.AddError(failure.NewError(ErrBenchmarkerReceive, err))
				}
				return
			}

			if res.AckedNonce != result.GetNonce() {
				step.AddError(failure.NewError(ErrBenchmarkerReport, fmt.Errorf("Invalid benchmark result nonce")))
				return
			}
			bResult.SentFirstResult()

			now := time.Now().UTC().Truncate(time.Millisecond)
			for b.Scenario.LatestMarkedAt().Equal(now) {
				<-time.After(1 * time.Millisecond)
				now = time.Now().UTC().Truncate(time.Millisecond)
			}
			bResult.Mark(now)
			result = b.generateLastReport(jobHandle, bResult)
			b.Scenario.Mark(now)

			err = reporter.Send(result)
			if err != nil {
				errCode := grpc.Code(err)
				if errCode != codes.DeadlineExceeded && errCode != codes.Canceled {
					step.AddError(failure.NewError(ErrBenchmarkerReport, err))
				}
				return
			}
			bResult.SentLastResult()

			res, err = reporter.Recv()
			if err != nil {
				errCode := grpc.Code(err)
				if errCode != codes.DeadlineExceeded && errCode != codes.Canceled {
					step.AddError(failure.NewError(ErrBenchmarkerReport, err))
				}
				return
			}

			if res.AckedNonce != result.GetNonce() {
				step.AddError(failure.NewError(ErrBenchmarkerReport, fmt.Errorf("Invalid nonce: got %d, expected %d", res.AckedNonce, result.GetNonce())))
				return
			}

			err = reporter.CloseSend()
			if err != nil {
				step.AddError(failure.NewError(ErrBenchmarkerReceive, err))
				return
			}
		}()
	}

	return nil
}

func (b *Benchmarker) receiveBenchmarkJob(ctx context.Context, client bench.BenchmarkQueueClient) (*bench.ReceiveBenchmarkJobResponse, error) {
	req := &bench.ReceiveBenchmarkJobRequest{
		TeamId: b.TeamID,
	}
	return client.ReceiveBenchmarkJob(ctx, req)
}

func (b *Benchmarker) generateCrashReport(job *bench.ReceiveBenchmarkJobResponse_JobHandle) *bench.ReportBenchmarkResultRequest {
	return &bench.ReportBenchmarkResultRequest{
		JobId:  job.GetJobId(),
		Handle: job.GetHandle(),
		Result: &resources.BenchmarkResult{
			Passed:   false,
			Finished: true,
			Score:    0,
			ScoreBreakdown: &resources.BenchmarkResult_ScoreBreakdown{
				Raw:       0,
				Deduction: 0,
			},
			Reason: "CRASH",
		},
		Nonce: rand.Int63n(300000),
	}
}

func (b *Benchmarker) generateFirstReport(job *bench.ReceiveBenchmarkJobResponse_JobHandle, result *model.BenchmarkResult) *bench.ReportBenchmarkResultRequest {
	markedAt, err := ptypes.TimestampProto(result.MarkedAt())
	if err != nil {
		panic(err)
	}

	return &bench.ReportBenchmarkResultRequest{
		JobId:  job.GetJobId(),
		Handle: job.GetHandle(),
		Result: &resources.BenchmarkResult{
			Passed:   false,
			Finished: false,
			Score:    0,
			ScoreBreakdown: &resources.BenchmarkResult_ScoreBreakdown{
				Raw:       0,
				Deduction: 0,
			},
			Reason:   "",
			MarkedAt: markedAt,
		},
		Nonce: rand.Int63n(300000),
	}
}

func (b *Benchmarker) generateLastReport(job *bench.ReceiveBenchmarkJobResponse_JobHandle, result *model.BenchmarkResult) *bench.ReportBenchmarkResultRequest {
	markedAt, err := ptypes.TimestampProto(result.MarkedAt())
	if err != nil {
		panic(err)
	}

	return &bench.ReportBenchmarkResultRequest{
		JobId:  job.GetJobId(),
		Handle: job.GetHandle(),
		Result: &resources.BenchmarkResult{
			Passed:   result.Passed,
			Finished: true,
			Score:    result.Score,
			ScoreBreakdown: &resources.BenchmarkResult_ScoreBreakdown{
				Raw:       result.ScoreRaw,
				Deduction: result.ScoreDeduction,
			},
			Reason:   result.Reason,
			MarkedAt: markedAt,
		},
		Nonce: rand.Int63n(300000),
	}
}

func (b *Benchmarker) dial() (*grpc.ClientConn, error) {
	host := fmt.Sprintf("%s:%d", b.GRPCHost, b.GRPCPort)

	tlsConfig := grpc.WithInsecure()
	if b.UseTLS {
		tlsConfig = grpc.WithTransportCredentials(credentials.NewClientTLSFromCert(nil, ""))
	}
	return grpc.Dial(
		host,
		tlsConfig,
		grpc.WithAuthority(b.GRPCHost),
		grpc.WithUserAgent("xsucon-benchmarker"),
	)
}
