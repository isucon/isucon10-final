package main

import (
	"context"
	"net"

	"github.com/isucon/isucon10-final/webapp/golang/util"

	"google.golang.org/grpc"

	"github.com/isucon/isucon10-final/webapp/golang/proto/xsuportal/services/bench"
)

type benchmarkQueueService struct {
}

func (b *benchmarkQueueService) Svc() *bench.BenchmarkQueueService {
	return &bench.BenchmarkQueueService{
		ReceiveBenchmarkJob: b.ReceiveBenchmarkJob,
	}
}

func (b *benchmarkQueueService) ReceiveBenchmarkJob(ctx context.Context, req *bench.ReceiveBenchmarkJobRequest) (*bench.ReceiveBenchmarkJobResponse, error) {
	return nil, nil
}

type benchmarkReportService struct {
}

func (b *benchmarkReportService) Svc() *bench.BenchmarkReportService {
	return &bench.BenchmarkReportService{
		ReportBenchmarkResult: b.ReportBenchmarkResult,
	}
}

func (b *benchmarkReportService) ReportBenchmarkResult(srv bench.BenchmarkReport_ReportBenchmarkResultServer) error {
	for {
		req, err := srv.Recv()
		if err != nil {
			return err
		}

		srv.Send(&bench.ReportBenchmarkResultResponse{
			AckedNonce: req.GetNonce(),
		})
	}
}

func main() {
	port := util.GetEnv("PORT", "50051")

	listener, err := net.Listen("tcp", ":"+port)
	if err != nil {
		panic(err)
	}

	server := grpc.NewServer()

	queue := &benchmarkQueueService{}
	report := &benchmarkReportService{}

	bench.RegisterBenchmarkQueueService(server, queue.Svc())
	bench.RegisterBenchmarkReportService(server, report.Svc())

	if err := server.Serve(listener); err != nil {
		panic(err)
	}
}
