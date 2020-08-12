package story

import (
	"bytes"
	"fmt"
	"github.com/isucon/isucon10-final/benchmarker/failure"
	"github.com/isucon/isucon10-final/benchmarker/model"
	"github.com/isucon/isucon10-final/benchmarker/session"
	"github.com/rs/zerolog"
	"sync"
)

type Story struct {
	targetHostName string
	targetBaseURL  string
	grpcHostName   string
	contest        *model.Contest

	Admin *model.Contestant

	lock          *sync.Mutex
	errors        *failure.Errors
	stdout        *bytes.Buffer
	stdoutLogger  zerolog.Logger
	stderr        *bytes.Buffer
	stderrLogger  zerolog.Logger
	browserPool   *sync.Pool
	benchmarkPool *sync.Pool

	teamByJobID map[int64]*model.Team
}

func NewStory(targetHostName string) (*Story, error) {
	admin, err := model.NewAdmin()
	if err != nil {
		return nil, err
	}

	stdout := bytes.NewBuffer([]byte{})
	stdoutLogger := zerolog.New(stdout).With().Timestamp().Logger()

	stderr := bytes.NewBuffer([]byte{})
	stderrLogger := zerolog.New(stderr).With().Timestamp().Logger()

	errors := failure.NewErrors()

	targetBaseURL := fmt.Sprintf("http://%s", targetHostName)
	contest := model.NewContest()

	browserPool := &sync.Pool{
		New: func() interface{} {
			browser, err := session.NewBrowser(targetBaseURL)
			if err != nil {
				errors.Add(failure.New(failure.ErrCritical, "ブラウザセッションの生成に失敗しました"))
			}
			return browser
		},
	}

	benchmarkPool := &sync.Pool{
		New: func() interface{} {
			benchmarker, err := session.NewBenchmarker(nil, contest.GRPCHost, contest.GRPCPort)
			if err != nil {
				errors.Add(failure.New(failure.ErrCritical, "ベンチマーカーの生成に失敗しました"))
			}
			return benchmarker
		},
	}

	return &Story{
		targetHostName: targetHostName,
		targetBaseURL:  targetBaseURL,
		grpcHostName:   fmt.Sprintf("%s:50051", targetHostName),
		contest:        contest,
		Admin:          admin,
		lock:           &sync.Mutex{},
		errors:         errors,
		stdout:         stdout,
		stdoutLogger:   stdoutLogger,
		stderr:         stderr,
		stderrLogger:   stderrLogger,
		browserPool:    browserPool,
		benchmarkPool:  benchmarkPool,
		teamByJobID:    map[int64]*model.Team{},
	}, nil
}

func (s *Story) AddTeam(team *model.Team) {
	s.lock.Lock()
	defer s.lock.Unlock()

	s.contest.Teams = append(s.contest.Teams, team)
}
