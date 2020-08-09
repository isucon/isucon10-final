package story

import (
	"context"
	"errors"
	"fmt"
	"github.com/isucon/isucon10-final/benchmarker/failure"
	"github.com/isucon/isucon10-final/benchmarker/session"
)

func (s *Story) Prologue(ctx context.Context) error {
	admin, err := session.NewBrowser(s.targetBaseURL)
	if err != nil {
		return failure.Translate(err, failure.ErrCritical)
	}

	admin.Contestant = s.Admin

	init, xerr, err := admin.InitializeAction(ctx)
	if xerr != nil {
		err = errors.New(xerr.GetHumanMessage())
	}
	if err != nil {
		return failure.Translate(err, failure.ErrCritical)
	}
	benchmarkServer := init.GetBenchmarkServer()
	s.grpcHostName = fmt.Sprintf("%s:%d", benchmarkServer.GetHost(), benchmarkServer.GetPort())

	return nil
}
