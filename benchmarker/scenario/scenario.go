package scenario

import (
	"sync"
	"time"

	"github.com/isucon/isucandar/agent"
	"github.com/isucon/isucandar/failure"
	"github.com/isucon/isucandar/pubsub"
	"github.com/isucon/isucon10-final/benchmarker/model"
	"github.com/isucon/isucon10-final/benchmarker/pushserver"
)

var (
	ErrScenarioCretical failure.StringCode = "scenario-critical"
	ErrScenarioCancel   failure.StringCode = "scenario-cancel"
)

type Scenario struct {
	mu           sync.RWMutex
	BaseURL      string
	UseTLS       bool
	PushService  *pushserver.Service
	Language     string
	Contest      *model.Contest
	TeamCapacity int32
	NoLoad       bool
	NoClar       bool

	bpubsub       *pubsub.PubSub
	rpubsub       *pubsub.PubSub
	firstMarkedAt time.Time
	markedAt      time.Time
}

func NewScenario() (*Scenario, error) {
	return &Scenario{
		mu:            sync.RWMutex{},
		TeamCapacity:  -1,
		NoLoad:        false,
		bpubsub:       pubsub.NewPubSub(),
		rpubsub:       pubsub.NewPubSub(),
		firstMarkedAt: time.Now().Add(24 * time.Hour),
		markedAt:      time.Now(),
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

func (s *Scenario) LatestMarkedAt() time.Time {
	s.mu.RLock()
	defer s.mu.RUnlock()

	return s.markedAt
}

func (s *Scenario) Mark(t time.Time) {
	s.mu.Lock()
	defer s.mu.Unlock()

	t = t.Truncate(time.Microsecond)
	if s.firstMarkedAt.After(t) {
		s.firstMarkedAt = t
	}
	if t.After(s.markedAt) {
		s.markedAt = t
	}
}
