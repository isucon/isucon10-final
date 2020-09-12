package scenario

import (
	"context"

	"github.com/rosylilly/isucandar"
	"github.com/rosylilly/isucandar/agent"
)

func (s *Scenario) Prepare(ctx context.Context, step *isucandar.BenchmarkStep) error {
	a, err := s.NewAgent(agent.WithNoCache(), agent.WithNoCookie())
	if err != nil {
		return err
	}
	a.Name = "benchmarker-initializer"

	initResponse, _, err := InitializeAction(ctx, a, s.Contest)
	if err != nil {
		return err
	}

	s.Language = initResponse.GetLanguage()
	s.Contest.GRPCHost = initResponse.GetBenchmarkServer().GetHost()
	s.Contest.GRPCPort = initResponse.GetBenchmarkServer().GetPort()

	return nil
}
