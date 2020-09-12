package model

import (
	"fmt"
	"sync"
	"sync/atomic"

	"github.com/isucon/isucon10-final/benchmarker/proto/xsuportal/services/contestant"
	"github.com/isucon/isucon10-final/benchmarker/random"
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

	ScoreGenerator             *random.ScoreGenerator
	scoreCounter               int64
	LatestScore                int64
	BestScore                  int64
	FrozenLatestScore          int64
	FroezenBestScore           int64
	benchmarkResults           []*BenchmarkResult
	latestEnqueuedBenchmarkJob *contestant.EnqueueBenchmarkJobResponse
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

		ScoreGenerator:             random.NewScoreGenerator(),
		scoreCounter:               0,
		LatestScore:                0,
		BestScore:                  0,
		FrozenLatestScore:          0,
		FroezenBestScore:           0,
		benchmarkResults:           []*BenchmarkResult{},
		latestEnqueuedBenchmarkJob: nil,
	}, nil
}

func (t *Team) TargetHost() string {
	if t.ID != 0 {
		return fmt.Sprintf("xsu-contestant-%05d", t.ID)
	}

	return ""
}

func (t *Team) NewResult() *BenchmarkResult {
	atomic.AddInt64(&t.scoreCounter, 1)
	score := t.ScoreGenerator.Generate(atomic.LoadInt64(&t.scoreCounter))

	return &BenchmarkResult{
		Passed:         !(score.FastFail || score.SlowFail),
		Score:          score.Int(),
		ScoreRaw:       score.BaseInt(),
		ScoreDeduction: score.DeductionInt(),
	}
}

func (t *Team) AddResult(result *BenchmarkResult) {
	t.mu.Lock()
	defer t.mu.Unlock()

	t.benchmarkResults = append(t.benchmarkResults, result)
	t.FrozenLatestScore = result.Score
	if t.FroezenBestScore < result.Score {
		t.FroezenBestScore = result.Score
	}
}

func (t *Team) SetScore(result *BenchmarkResult) {
	t.mu.Lock()
	defer t.mu.Unlock()

	t.LatestScore = result.Score
	if t.BestScore < result.Score {
		t.BestScore = result.Score
	}
}

func (t *Team) Enqueued(job *contestant.EnqueueBenchmarkJobResponse) {
	t.mu.Lock()
	defer t.mu.Unlock()

	t.latestEnqueuedBenchmarkJob = job
}

func (t *Team) GetLatestEnqueuedBenchmarkJob() *contestant.EnqueueBenchmarkJobResponse {
	t.mu.RLock()
	defer t.mu.RUnlock()

	return t.latestEnqueuedBenchmarkJob
}
