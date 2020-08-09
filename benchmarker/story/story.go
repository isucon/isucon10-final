package story

import (
	"fmt"
	"github.com/isucon/isucon10-final/benchmarker/model"
)

type Story struct {
	targetHostName string
	targetBaseURL  string
	grpcHostName   string
	contest        *model.Contest

	Admin *model.Contestant
}

func NewStory(targetHostName string) (*Story, error) {
	admin, err := model.NewAdmin()
	if err != nil {
		return nil, err
	}

	return &Story{
		targetHostName: targetHostName,
		targetBaseURL:  fmt.Sprintf("http://%s", targetHostName),
		grpcHostName:   fmt.Sprintf("%s:50051", targetHostName),
		contest:        model.NewContest(),
		Admin:          admin,
	}, nil
}
