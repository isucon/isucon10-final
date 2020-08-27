package story

import (
	"context"
	"fmt"
	"github.com/isucon/isucon10-final/benchmarker/failure"
	"github.com/isucon/isucon10-final/benchmarker/model"
	"github.com/isucon/isucon10-final/benchmarker/session"
	"sync"
	"time"
)

func (s *Story) Prologue(ctx context.Context) error {
	var wg sync.WaitGroup

	s.stdoutLogger.Info().Msg("Start preflight check")

	admin, err := session.NewBrowser(s.targetBaseURL)
	if err != nil {
		return failure.Translate(err, failure.ErrCritical)
	}

	admin.Contestant = s.Admin

	wg.Add(1)
	go func() {
		ctx, cancel := context.WithTimeout(ctx, InitializeTimeout)
		defer cancel()
		defer wg.Done()

		s.stdoutLogger.Debug().Msg("Initialize call")

		init, xerr, err := admin.InitializeAction(ctx)
		if xerr != nil {
			s.errors.Add(failure.New(failure.ErrApplication, xerr.GetHumanMessage()))
			return
		}
		if err != nil {
			s.errors.Add(failure.Translate(err, failure.ErrCritical))
			return
		}

		benchmarkServer := init.GetBenchmarkServer()
		s.grpcHostName = fmt.Sprintf("%s:%d", benchmarkServer.GetHost(), benchmarkServer.GetPort())
		s.stdoutLogger.Debug().
			Str("language", init.GetLanguage()).
			Str("grpcServerHost", s.grpcHostName).
			Msg("Initialize called")
	}()

	wg.Wait()
	if s.errors.Len() > 0 {
		return nil
	}

	wg.Add(1)
	go func() {
		defer wg.Done()

		_, xerr, err := admin.LoginAction(ctx)
		if xerr != nil {
			err = failure.New(failure.ErrApplication, xerr.GetHumanMessage())
		}
		if err != nil {
			s.errors.Add(failure.Translate(err, failure.ErrCritical))
			return
		}

		s.stdoutLogger.Debug().
			Str("id", admin.Contestant.ID).
			Msg("Login")

		now := time.Now()
		s.contest.RegistrationOpenAt = now.Add(-1 * time.Hour)
		s.contest.ContestStartsAt = now.Add(10 * time.Minute)
		s.contest.ContestFreezesAt = now.Add(20 * time.Minute)
		s.contest.ContestEndsAt = now.Add(30 * time.Minute)

		_, xerr, err = admin.UpdateContest(ctx, s.contest)
		if xerr != nil {
			err = failure.New(failure.ErrApplication, xerr.GetHumanMessage())
		}
		if err != nil {
			s.errors.Add(failure.Translate(err, failure.ErrCritical))
			return
		}

		s.stdoutLogger.Debug().
			Time("registrationOpenAt", s.contest.RegistrationOpenAt).
			Time("contestStartsAt", s.contest.ContestStartsAt).
			Time("contestFreezesAt", s.contest.ContestFreezesAt).
			Time("contestEndsAt", s.contest.ContestEndsAt).
			Msg("Update Contest info")
	}()

	wg.Wait()

	if s.errors.Len() > 0 {
		return nil
	}

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

	_, xerr, err := leaderBrowser.SignupAction(ctx)
	if xerr != nil {
		err = failure.New(failure.ErrApplication, xerr.GetHumanMessage())
	}
	if err != nil {
		return failure.Translate(err, failure.ErrCritical)
	}
	s.stdoutLogger.Debug().
		Str("id", leader.ID).
		Str("password", leader.Password).
		Bool("isStudent", leader.IsStudent).
		Msg("Leader singup")

	_, xerr, err = leaderBrowser.CreateTeam(ctx, team)
	if xerr != nil {
		err = failure.New(failure.ErrApplication, xerr.GetHumanMessage())
	}
	if err != nil {
		return failure.Translate(err, failure.ErrCritical)
	}

	return nil
}
