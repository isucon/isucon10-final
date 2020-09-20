package main

import (
	"context"

	"github.com/isucon/isucon10-final/webapp/golang/proto/xsuportal/services/bench"
)

type BenchmarkServer struct {
}

func (b *BenchmarkServer) ReceiveBenchmarkJob(context.Context, *bench.ReceiveBenchmarkJobRequest) (*bench.ReceiveBenchmarkJobResponse, error) {
	return nil, nil
}

func main() {}
