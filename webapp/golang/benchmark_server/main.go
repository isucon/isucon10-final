package main

import (
	"context"
	"net"

	"github.com/isucon/isucon10-final/webapp/golang/util"

	"google.golang.org/grpc"

	"github.com/isucon/isucon10-final/webapp/golang/proto/xsuportal/services/bench"
)

type BenchmarkService struct {
}

func (b *BenchmarkService) ReceiveBenchmarkJob(ctx context.Context, req *bench.ReceiveBenchmarkJobRequest) (*bench.ReceiveBenchmarkJobResponse, error) {
	return nil, nil
}

func (b *BenchmarkService) ReportBenchmarkResult(srv bench.BenchmarkReport_ReportBenchmarkResultServer) error {
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
	service := &BenchmarkService{}

	bench.RegisterBenchmarkQueueServer(server, service)
	bench.RegisterBenchmarkReportServer(server, service)

	if err := server.Serve(listener); err != nil {
		panic(err)
	}
}
