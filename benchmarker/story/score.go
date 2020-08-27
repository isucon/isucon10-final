package story

import (
	"encoding/json"
	"github.com/isucon/isucon10-final/benchmarker/failure"
	"sync/atomic"
)

type Score struct {
	num *int64
}

func NewScore() *Score {
	num := int64(0)
	return &Score{num: &num}
}

func (s *Score) Incr() {
	atomic.AddInt64(s.num, 1)
}

func (s *Score) Load() int64 {
	return atomic.LoadInt64(s.num)
}

func (s Score) MarshalJSON() ([]byte, error) {
	n := s.Load()

	return json.Marshal(n)
}

type Scores struct {
	CreateTeam              *Score
	GetDashboardByOperator  *Score
	GetDashboardByDeveloper *Score
	FinishBenchmark         *Score
	GetListBenchmarks       *Score
}

func NewScores() *Scores {
	return &Scores{
		CreateTeam:              NewScore(),
		GetDashboardByOperator:  NewScore(),
		GetDashboardByDeveloper: NewScore(),
		FinishBenchmark:         NewScore(),
		GetListBenchmarks:       NewScore(),
	}
}

func (s *Scores) String() string {
	bytes, _ := json.Marshal(s)
	return string(bytes)
}

const (
	SCORE_GET_DASHBOARD_BY_OPERATOR  = 1
	SCORE_GET_DASHBOARD_BY_DEVELOPER = 3
	SCORE_FINISH_BENCHMARK           = 10
	SCORE_CREATE_TEAM                = 5
	SCORE_GET_LIST_BENCHMARKS        = 1
)

func (s *Scores) Sum() int64 {
	createTeam := s.CreateTeam.Load() * SCORE_CREATE_TEAM
	getDashboardByOperator := s.GetDashboardByOperator.Load() * SCORE_GET_DASHBOARD_BY_OPERATOR
	getDashboardByDeveloper := s.GetDashboardByDeveloper.Load() * SCORE_GET_DASHBOARD_BY_DEVELOPER
	finishBenchmark := s.FinishBenchmark.Load() * SCORE_FINISH_BENCHMARK
	getListBenchmarks := s.GetListBenchmarks.Load() * SCORE_GET_LIST_BENCHMARKS

	return createTeam + getDashboardByOperator + getDashboardByDeveloper + finishBenchmark + getListBenchmarks
}

const (
	SCORE_DEDUCTION_CRITICAL    = 1000
	SCORE_DECUCTION_APPLICATION = 20
	SCORE_DECUCTION_TRIVIAL     = 1
)

func (s *Scores) Deduction(errors *failure.Errors) int64 {
	_, critical, application, trivial := errors.Get()

	return int64(critical*SCORE_DEDUCTION_CRITICAL + application*SCORE_DECUCTION_APPLICATION + trivial*SCORE_DECUCTION_TRIVIAL)
}
