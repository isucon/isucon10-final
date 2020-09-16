package scenario

import (
	"sync"

	"github.com/isucon/isucon10-final/benchmarker/model"
	"github.com/rosylilly/isucandar/agent"
	"github.com/rosylilly/isucandar/failure"
	"github.com/rosylilly/isucandar/pubsub"
)

var (
	ErrScenarioCretical failure.StringCode = "scenario-critical"
)

type Scenario struct {
	mu           sync.RWMutex
	BaseURL      string
	Language     string
	Contest      *model.Contest
	TeamCapacity int32

	bpubsub *pubsub.PubSub
	rpubsub *pubsub.PubSub
}

func NewScenario() (*Scenario, error) {
	contest := model.NewContest()
	return &Scenario{
		mu:           sync.RWMutex{},
		Contest:      contest,
		TeamCapacity: -1,
		bpubsub:      pubsub.NewPubSub(),
		rpubsub:      pubsub.NewPubSub(),
	}, nil
}

func (s *Scenario) NewAgent(opts ...agent.AgentOption) (*agent.Agent, error) {
	opts = append(opts, agent.WithBaseURL(s.BaseURL))
	return agent.NewAgent(opts...)
}

func (s *Scenario) AddBenchmarker(teamID int64) {
	s.bpubsub.Publish(teamID)
}

func (s *Scenario) AddAudience(count int) {
	for i := 0; i < count; i++ {
		s.rpubsub.Publish(true)
	}
}
