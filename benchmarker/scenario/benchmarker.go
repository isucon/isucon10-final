package scenario

import (
	"context"
	"fmt"
	"math/rand"

	"github.com/isucon/isucon10-final/benchmarker/model"
	"github.com/isucon/isucon10-final/benchmarker/proto/xsuportal/resources"
	"github.com/isucon/isucon10-final/benchmarker/proto/xsuportal/services/bench"
	"github.com/rosylilly/isucandar"
	"github.com/rosylilly/isucandar/failure"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
)

var (
	ErrBenchmarkerReceive failure.StringCode = "benchmarker-receive"
	ErrBenchmarkerReport  failure.StringCode = "benchmarker-report"
)

type Benchmarker struct {
	Scenario *Scenario
	GRPCHost string
	GRPCPort int64
	TeamID   int64
}

func (s *Scenario) NewBenchmarker(id int64) *Benchmarker {
	return &Benchmarker{
		Scenario: s,
		GRPCHost: s.Contest.GRPCHost,
		GRPCPort: s.Contest.GRPCPort,
		TeamID:   id,
	}
}

func (b *Benchmarker) Process(ctx context.Context, step *isucandar.BenchmarkStep) error {
	host := fmt.Sprintf("%s:%d", b.GRPCHost, b.GRPCPort)

	conn, err := grpc.Dial(host, grpc.WithInsecure(), grpc.WithUserAgent("xsucon-benchmarker"))
	if err != nil {
		return failure.NewError(ErrScenarioCretical, err)
	}
	defer conn.Close()

	queue := bench.NewBenchmarkQueueClient(conn)
	report := bench.NewBenchmarkReportClient(conn)

	for ctx.Err() == nil {
		job, err := b.receiveBenchmarkJob(ctx, queue)
		if err != nil {
			errCode := grpc.Code(err)
			if errCode != codes.DeadlineExceeded && errCode != codes.Canceled {
				step.AddError(failure.NewError(ErrBenchmarkerReceive, err))
			}
			continue
		}

		jobHandle := job.GetJobHandle()
		if jobHandle == nil {
			continue
		}

		b.Scenario.mu.RLock()
		teamID, ok := b.Scenario.teamIDsByJobID[jobHandle.GetJobId()]
		b.Scenario.mu.RUnlock()
		if !ok {
			step.AddError(failure.NewError(ErrBenchmarkerReceive, fmt.Errorf("Unknown team id")))
			continue
		}

		team := b.Scenario.Contest.GetTeam(teamID)
		if team == nil {
			step.AddError(failure.NewError(ErrBenchmarkerReceive, fmt.Errorf("Unknown team")))
			continue
		}

		bResult := team.NewResult()

		reporter, err := report.ReportBenchmarkResult(ctx)
		if err != nil {
			errCode := grpc.Code(err)
			if errCode != codes.DeadlineExceeded && errCode != codes.Canceled {
				step.AddError(failure.NewError(ErrBenchmarkerReceive, err))
			}
			continue
		}

		result := b.generateFirstReport(jobHandle)
		err = reporter.Send(result)
		if err != nil {
			errCode := grpc.Code(err)
			if errCode != codes.DeadlineExceeded && errCode != codes.Canceled {
				step.AddError(failure.NewError(ErrBenchmarkerReceive, err))
			}
			continue
		}
		res, err := reporter.Recv()
		if err != nil {
			errCode := grpc.Code(err)
			if errCode != codes.DeadlineExceeded && errCode != codes.Canceled {
				step.AddError(failure.NewError(ErrBenchmarkerReceive, err))
			}
			continue
		}

		if res.AckedNonce != result.GetNonce() {
			step.AddError(failure.NewError(ErrBenchmarkerReport, fmt.Errorf("Invalid benchmark result nonce")))
			continue
		}

		result = b.generateLastReport(jobHandle, bResult)
		err = reporter.Send(result)
		if err != nil {
			errCode := grpc.Code(err)
			if errCode != codes.DeadlineExceeded && errCode != codes.Canceled {
				step.AddError(failure.NewError(ErrBenchmarkerReport, err))
			}
			continue
		}
		res, err = reporter.Recv()
		if err != nil {
			errCode := grpc.Code(err)
			if errCode != codes.DeadlineExceeded && errCode != codes.Canceled {
				step.AddError(failure.NewError(ErrBenchmarkerReport, err))
			}
			continue
		}

		if res.AckedNonce != result.GetNonce() {
			step.AddError(failure.NewError(ErrBenchmarkerReport, fmt.Errorf("Invalid nonce: got %d, expected %d", res.AckedNonce, result.GetNonce())))
			continue
		}

		err = reporter.CloseSend()
		if err != nil {
			step.AddError(failure.NewError(ErrBenchmarkerReceive, err))
			continue
		}
	}

	return nil
}

func (b *Benchmarker) receiveBenchmarkJob(ctx context.Context, client bench.BenchmarkQueueClient) (*bench.ReceiveBenchmarkJobResponse, error) {
	req := &bench.ReceiveBenchmarkJobRequest{
		TeamId: b.TeamID,
	}
	return client.ReceiveBenchmarkJob(ctx, req)
}

func (b *Benchmarker) generateFirstReport(job *bench.ReceiveBenchmarkJobResponse_JobHandle) *bench.ReportBenchmarkResultRequest {
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
			Reason: "",
		},
		Nonce: rand.Int63n(300000),
	}
}

func (b *Benchmarker) generateLastReport(job *bench.ReceiveBenchmarkJobResponse_JobHandle, result *model.BenchmarkResult) *bench.ReportBenchmarkResultRequest {
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
			Reason: "",
		},
		Nonce: rand.Int63n(300000),
	}
}
