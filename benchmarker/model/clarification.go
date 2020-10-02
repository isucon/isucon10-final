package model

import (
	"sync"
	"sync/atomic"
	"time"

	"github.com/isucon/isucon10-final/benchmarker/random"
)

var (
	generatedClarCount int64 = 0
	disclosePer        int64 = 20
)

type Clarification struct {
	team      *Team
	id        int64
	TeamID    int64
	Question  string
	Answer    string
	Disclose  bool
	answered  uint32
	smu       sync.RWMutex
	sentAt    time.Time
	createdAt time.Time
}

func NewClarification(team *Team) *Clarification {
	count := atomic.AddInt64(&generatedClarCount, 1)
	disclose := (count % disclosePer) == 0

	return &Clarification{
		team:      team,
		id:        -1,
		TeamID:    team.ID,
		Question:  random.Question(count),
		Answer:    random.Answer(),
		Disclose:  disclose,
		answered:  0,
		smu:       sync.RWMutex{},
		sentAt:    time.Now().UTC().Add(1 * time.Minute), // とにかく遠くに設定する
		createdAt: time.Now().UTC().Add(1 * time.Minute), // とにかく遠くに設定する
	}
}

func (s *Clarification) ID() int64 {
	return atomic.LoadInt64(&s.id)
}

func (s *Clarification) SetID(id int64) {
	atomic.StoreInt64(&s.id, id)
}

func (c *Clarification) IsAnswered() bool {
	return atomic.LoadUint32(&c.answered) != 0
}

func (c *Clarification) Answered() {
	atomic.StoreUint32(&c.answered, 1)
}

func (c *Clarification) CreatedAt() time.Time {
	c.smu.RLock()
	defer c.smu.RUnlock()

	return c.createdAt
}

func (c *Clarification) SetCreatedAt(t time.Time) {
	c.smu.Lock()
	defer c.smu.Unlock()

	c.createdAt = t
}

func (c *Clarification) SentAt() time.Time {
	c.smu.RLock()
	defer c.smu.RUnlock()

	return c.sentAt
}

func (c *Clarification) SetSentAt(t time.Time) {
	c.smu.Lock()
	defer c.smu.Unlock()

	c.sentAt = t
}
