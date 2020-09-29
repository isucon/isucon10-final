package model

import (
	"context"
	"fmt"
	"sync"
	"sync/atomic"
	"time"

	"github.com/isucon/isucon10-final/benchmarker/proto/xsuportal/services/contestant"
	"github.com/isucon/isucon10-final/benchmarker/random"
)

var (
	scoreCounter int64 = 1
)

type Team struct {
	mu           sync.RWMutex
	ID           int64
	TeamName     string
	EmailAddress string

	IsStudent bool
	Leader    *Contestant
	Developer *Contestant
	Operator  *Contestant

	ScoreGenerator   *random.ScoreGenerator
	benchmarkResults []*BenchmarkResult
	EnqueueLock      chan struct{}
	NonClarification bool

	cmu            sync.RWMutex
	clarifications []*Clarification
}

func NewTeam() (*Team, error) {
	// 1/6 の確率で学生チーム
	isStudent := random.Pecentage(1, 6)

	leader, err := NewContestant()
	if err != nil {
		return nil, err
	}
	developer, err := NewContestant()
	if err != nil {
		return nil, err
	}
	operator, err := NewContestant()
	if err != nil {
		return nil, err
	}

	if isStudent {
		// 学生チームなら全員を強制的に学生に
		leader.IsStudent = true
		developer.IsStudent = true
		operator.IsStudent = true
	} else {
		// 学生チームでないならリーダーを学生じゃなくすることで非学生を保証
		leader.IsStudent = false
	}

	return &Team{
		mu:           sync.RWMutex{},
		TeamName:     random.TeamName(),
		EmailAddress: random.Alphabet(16) + "@example.com",
		IsStudent:    isStudent,
		Leader:       leader,
		Developer:    developer,
		Operator:     operator,

		ScoreGenerator:   random.NewScoreGenerator(),
		benchmarkResults: []*BenchmarkResult{},
		EnqueueLock:      make(chan struct{}, 1),
		NonClarification: false,

		cmu:            sync.RWMutex{},
		clarifications: []*Clarification{},
	}, nil
}

func (t *Team) TargetHost() string {
	if t.ID != 0 {
		return fmt.Sprintf("xsu-contestant-%05d", t.ID)
	}

	return ""
}

func (t *Team) newResult(id int64) *BenchmarkResult {
	count := atomic.AddInt64(&scoreCounter, 1)
	score := t.ScoreGenerator.Generate(count)
	passed := !(score.FastFail || score.SlowFail)

	return &BenchmarkResult{
		id:             id,
		Passed:         passed,
		Score:          score.Int(),
		ScoreRaw:       score.BaseInt(),
		ScoreDeduction: score.DeductionInt(),
		Reason:         random.Reason(passed),
		markedAt:       time.Unix(0, 0).UTC(),
	}
}

func (t *Team) GetQueuedBenckmarkResult() *BenchmarkResult {
	t.mu.RLock()
	defer t.mu.RUnlock()

	for _, b := range t.benchmarkResults {
		if !b.IsSentFirstResult() {
			return b
		}
	}

	return nil
}

func (t *Team) GetWaitingBenchmarkResult() *BenchmarkResult {
	t.mu.RLock()
	defer t.mu.RUnlock()

	for _, b := range t.benchmarkResults {
		if !b.IsSeen() {
			return b
		}
	}

	return nil
}

func (t *Team) BenchmarkResults(at time.Time) []*BenchmarkResult {
	t.mu.RLock()
	defer t.mu.RUnlock()

	results := []*BenchmarkResult{}
	for _, b := range t.benchmarkResults {
		if b.In(at) {
			results = append(results, b)
		}
	}
	return results
}

func (t *Team) AllBenchmarkResults() []*BenchmarkResult {
	t.mu.RLock()
	defer t.mu.RUnlock()

	results := []*BenchmarkResult{}
	for _, b := range t.benchmarkResults {
		results = append(results, b)
	}
	return results
}

func (t *Team) LatestScore(at time.Time) (int64, time.Time) {
	t.mu.RLock()
	defer t.mu.RUnlock()

	latest := int64(0)
	marked := time.Time{}
	for _, b := range t.benchmarkResults {
		if b.In(at) {
			if b.Passed {
				latest = b.Score
			} else {
				latest = 0
			}
			marked = b.MarkedAt()
		}
	}
	return latest, marked
}

func (t *Team) BestScore(at time.Time) (int64, time.Time) {
	t.mu.RLock()
	defer t.mu.RUnlock()

	best := int64(0)
	marked := time.Time{}
	for _, b := range t.benchmarkResults {
		if b.Passed && b.Score > best && b.In(at) {
			best = b.Score
			marked = b.MarkedAt()
		}
	}
	return best, marked
}

func (t *Team) MaximumMarkedAt() time.Time {
	t.mu.RLock()
	defer t.mu.RUnlock()

	m := time.Unix(0, 0).UTC()
	for _, b := range t.benchmarkResults {
		if b.IsSeen() && b.MarkedAt().After(m) {
			m = b.MarkedAt()
		}
	}
	return m
}

func (t *Team) Enqueued(job *contestant.EnqueueBenchmarkJobResponse) {
	t.mu.Lock()
	defer t.mu.Unlock()

	result := t.newResult(job.GetJob().GetId())
	t.benchmarkResults = append(t.benchmarkResults, result)
}

func (t *Team) AddClar(clar *Clarification) {
	t.cmu.Lock()
	defer t.cmu.Unlock()

	t.clarifications = append(t.clarifications, clar)
}

func (t *Team) Clarifications() []*Clarification {
	t.cmu.RLock()
	defer t.cmu.RUnlock()

	clars := make([]*Clarification, len(t.clarifications))
	copy(clars, t.clarifications[:])

	return clars
}

func (t *Team) HasUnresolvedClar() bool {
	t.cmu.RLock()
	defer t.cmu.RUnlock()

	for _, clar := range t.clarifications {
		if !clar.IsAnswered() {
			return true
		}
	}
	return false
}

func (t *Team) WaitAllClarResolve(ctx context.Context) <-chan struct{} {
	ch := make(chan struct{})

	if t.HasUnresolvedClar() {
		go func() {
			for t.HasUnresolvedClar() {
				<-time.After(1 * time.Millisecond)
			}
			close(ch)
		}()
	} else {
		close(ch)
	}

	return ch
}
