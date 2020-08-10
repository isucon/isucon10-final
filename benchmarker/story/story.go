package story

import (
	"bytes"
	"fmt"
	"github.com/isucon/isucon10-final/benchmarker/model"
	"github.com/rs/zerolog"
)

type Story struct {
	targetHostName string
	targetBaseURL  string
	grpcHostName   string
	contest        *model.Contest

	Admin *model.Contestant

	stdout       *bytes.Buffer
	stdoutLogger zerolog.Logger
	stderr       *bytes.Buffer
	stderrLogger zerolog.Logger
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

	return &Story{
		targetHostName: targetHostName,
		targetBaseURL:  fmt.Sprintf("http://%s", targetHostName),
		grpcHostName:   fmt.Sprintf("%s:50051", targetHostName),
		contest:        model.NewContest(),
		Admin:          admin,
		stdout:         stdout,
		stdoutLogger:   stdoutLogger,
		stderr:         stderr,
		stderrLogger:   stderrLogger,
	}, nil
}
