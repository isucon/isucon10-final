package scenario

import (
	"context"
	"time"

	"github.com/isucon/isucandar"
	"github.com/isucon/isucandar/agent"
	"github.com/isucon/isucon10-final/benchmarker/model"
)

func (s *Scenario) Prepare(ctx context.Context, step *isucandar.BenchmarkStep) error {
	a, err := s.NewAgent(agent.WithNoCache(), agent.WithNoCookie())
	if err != nil {
		return err
	}
	a.Name = "benchmarker-initializer"

	s.Contest = model.NewContest(time.Now())
	initResponse, _, err := InitializeAction(ctx, a, s.Contest)
	if err != nil {
		return err
	}

	s.Language = initResponse.GetLanguage()
	s.Contest.GRPCHost = initResponse.GetBenchmarkServer().GetHost()
	s.Contest.GRPCPort = initResponse.GetBenchmarkServer().GetPort()

	return nil
}
