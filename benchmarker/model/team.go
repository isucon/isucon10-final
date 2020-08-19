package model

import (
	"fmt"
	"github.com/isucon/isucon10-final/benchmarker/proto/xsuportal/services/bench"
	"github.com/isucon/isucon10-final/benchmarker/proto/xsuportal/services/contestant"
	"github.com/isucon/isucon10-final/benchmarker/random"
	"sync"
)

type Team struct {
	ID           int64
	TeamName     string
	EmailAddress string

	Hosts []*Host

	IsStudent bool
	Leader    *Contestant
	Developer *Contestant
	Operator  *Contestant

	Lock                       *sync.Mutex
	ScoreGenerator             *random.ScoreGenerator
	Scores                     []*bench.ReportBenchmarkResultRequest
	LatestScore                int64
	BestScore                  int64
	LatestEnqueuedBenchmarkJob *contestant.EnqueueBenchmarkJobResponse
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

	hosts := []*Host{{}, {}, {}}

	return &Team{
		TeamName:     random.Alphabet(20),
		EmailAddress: random.Alphabet(16) + "@example.com",
		Hosts:        hosts,
		IsStudent:    isStudent,
		Leader:       leader,
		Developer:    developer,
		Operator:     operator,

		Lock:                       &sync.Mutex{},
		ScoreGenerator:             random.NewScoreGenerator(),
		Scores:                     make([]*bench.ReportBenchmarkResultRequest, 0, 10),
		LatestScore:                0,
		BestScore:                  0,
		LatestEnqueuedBenchmarkJob: nil,
	}, nil
}

func (t *Team) TargetHost() string {
	if t.ID != 0 {
		return fmt.Sprintf("xsu-contestant-%05d", t.ID)
	}

	return t.Hosts[0].Name
}

func (t *Team) AddScore(score *bench.ReportBenchmarkResultRequest) {
	t.Lock.Lock()
	defer t.Lock.Unlock()

	t.Scores = append(t.Scores, score)
	num := score.GetResult().GetScore()
	t.LatestScore = num
	if t.BestScore < num {
		t.BestScore = num
	}
	t.LatestEnqueuedBenchmarkJob = nil
}
