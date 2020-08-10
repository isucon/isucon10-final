package story

import (
	"context"
	"errors"
	"fmt"
	"github.com/isucon/isucon10-final/benchmarker/failure"
	"github.com/isucon/isucon10-final/benchmarker/model"
	"github.com/isucon/isucon10-final/benchmarker/session"
	"time"
)

func (s *Story) Prologue(ctx context.Context) error {
	s.stdoutLogger.Info().Msg("Start preflight check")

	admin, err := session.NewBrowser(s.targetBaseURL)
	if err != nil {
		return failure.Translate(err, failure.ErrCritical)
	}

	admin.Contestant = s.Admin

	s.stdoutLogger.Info().Msg("Initialize call")

	init, xerr, err := admin.InitializeAction(ctx)
	if xerr != nil {
		err = errors.New(xerr.GetHumanMessage())
	}
	if err != nil {
		return failure.Translate(err, failure.ErrCritical)
	}

	benchmarkServer := init.GetBenchmarkServer()
	s.grpcHostName = fmt.Sprintf("%s:%d", benchmarkServer.GetHost(), benchmarkServer.GetPort())
	s.stdoutLogger.Info().
		Str("language", init.GetLanguage()).
		Str("grpcServerHost", s.grpcHostName).
		Msg("Initialize called")

	now := time.Now()
	s.contest.RegistrationOpenAt = now.Add(-1 * time.Hour)
	s.contest.ContestStartsAt = now.Add(10 * time.Minute)
	s.contest.ContestFreezesAt = now.Add(20 * time.Minute)
	s.contest.ContestEndsAt = now.Add(30 * time.Minute)

	_, xerr, err = admin.UpdateContest(ctx, s.contest)
	if xerr != nil {
		err = errors.New(xerr.GetHumanMessage())
	}
	if err != nil {
		return failure.Translate(err, failure.ErrCritical)
	}
	s.stdoutLogger.Info().
		Time("registrationOpenAt", s.contest.RegistrationOpenAt).
		Time("contestStartsAt", s.contest.ContestStartsAt).
		Time("contestFreezesAt", s.contest.ContestFreezesAt).
		Time("contestEndsAt", s.contest.ContestEndsAt).
		Msg("Update Contest info")

	team, err := model.NewTeam()
	if err != nil {
		return failure.Translate(err, failure.ErrCritical)
	}
	leader := team.Leader

	leaderBrowser, err := session.NewBrowser(s.targetBaseURL)
	if err != nil {
		return failure.Translate(err, failure.ErrCritical)
	}
	leaderBrowser.Contestant = leader

	_, xerr, err = leaderBrowser.SignupAction(ctx)
	if xerr != nil {
		err = errors.New(xerr.GetHumanMessage())
	}
	if err != nil {
		return failure.Translate(err, failure.ErrCritical)
	}
	s.stdoutLogger.Info().
		Str("id", leader.ID).
		Str("password", leader.Password).
		Bool("isStudent", leader.IsStudent).
		Msg("Leader singup")

	_, xerr, err = leaderBrowser.CreateTeam(ctx, team)
	if xerr != nil {
		err = errors.New(xerr.GetHumanMessage())
	}
	if err != nil {
		return failure.Translate(err, failure.ErrCritical)
	}

	return nil
}
