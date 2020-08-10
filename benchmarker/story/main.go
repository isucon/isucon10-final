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

func (s *Story) Main(ctx context.Context) error {
	s.stdoutLogger.Info().Msg("Start main check")

	s.initialize(ctx)
	s.registration(ctx)

	return ctx.Err()
}

func (s *Story) initialize(ctx context.Context) error {
	var wg sync.WaitGroup

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
		if xerr != nil && err == nil {
			err = failure.New(failure.ErrApplication, xerr.GetHumanMessage())
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

	now := time.Now()
	s.contest.RegistrationOpenAt = now.Add(0)
	s.contest.ContestStartsAt = now.Add(10 * time.Second)
	s.contest.ContestFreezesAt = now.Add(50 * time.Second)
	s.contest.ContestEndsAt = now.Add(55 * time.Second)

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

	return nil
}

func (s *Story) registration(ctx context.Context) {
	ctx, cancel := context.WithCancel(ctx)
	now := time.Now()
	timer := time.After(s.contest.ContestStartsAt.Sub(now) - 1*time.Second)

	// TODO: 20並列で登録だなんだのリクエストを送りつけてるけど、これ80ぐらいにすると通らない
	parallelism := make(chan bool, 40)
	wg := &sync.WaitGroup{}
	execute := true

	go func() {
		<-timer
		execute = false

		<-time.After(1 * time.Second)
		close(parallelism)
		cancel()
	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		for execute {
			parallelism <- true
			wg.Add(1)
			go func() {
				defer func() { <-parallelism }()
				defer wg.Done()
				s.registerTeam(ctx)
			}()
		}
	}()

	wg.Wait()
}

func (s *Story) registerTeam(ctx context.Context) error {
	team, err := model.NewTeam()
	if err != nil {
		return failure.New(failure.ErrCritical, "チームの生成に失敗しました")
	}

	browser := s.browserPool.Get().(*session.Browser)
	defer s.browserPool.Put(browser)

	s.stdoutLogger.Debug().Str("TeamName", team.TeamName).Msg("チームを生成")

	browser.Contestant = team.Leader

	_, xerr, err := browser.SignupAction(ctx)
	if xerr != nil {
		err = failure.New(failure.ErrApplication, xerr.GetHumanMessage())
	}
	if err != nil {
		s.errors.Add(err)
		return nil
	}

	_, xerr, err = browser.LoginAction(ctx)
	if xerr != nil {
		err = failure.New(failure.ErrApplication, xerr.GetHumanMessage())
	}
	if err != nil {
		s.errors.Add(err)
		return nil
	}

	createTeam, xerr, err := browser.CreateTeam(ctx, team)
	if xerr != nil {
		if xerr.GetCode() == 403 {
			// チーム登録期間外に達したため失敗
			return nil
		} else {
			err = failure.New(failure.ErrApplication, xerr.GetHumanMessage())
		}
	}
	if err != nil {
		s.errors.Add(err)
		return nil
	}

	team.ID = createTeam.GetTeamId()
	s.AddTeam(team)

	registrationSession, xerr, err := browser.GetRegistrationSession(ctx)
	if xerr != nil {
		err = failure.New(failure.ErrApplication, xerr.GetHumanMessage())
	}
	if err != nil {
		s.errors.Add(err)
		return nil
	}

	inviteToken := registrationSession.GetInviteToken()

	s.joinTeam(ctx, inviteToken, team, team.Developer)
	s.joinTeam(ctx, inviteToken, team, team.Operator)

	return nil
}

func (s *Story) joinTeam(ctx context.Context, inviteToken string, team *model.Team, contestant *model.Contestant) error {
	if team.Leader.ID == contestant.ID {
		return nil
	}

	browser := s.browserPool.Get().(*session.Browser)
	defer s.browserPool.Put(browser)

	browser.Contestant = contestant
	_, xerr, err := browser.SignupAction(ctx)
	if xerr != nil {
		err = failure.New(failure.ErrApplication, xerr.GetHumanMessage())
	}
	if err != nil {
		s.errors.Add(err)
		return nil
	}

	_, xerr, err = browser.LoginAction(ctx)
	if xerr != nil {
		err = failure.New(failure.ErrApplication, xerr.GetHumanMessage())
	}
	if err != nil {
		s.errors.Add(err)
		return nil
	}

	_, xerr, err = browser.JoinTeam(ctx, team, inviteToken)
	if xerr != nil {
		err = failure.New(failure.ErrApplication, xerr.GetHumanMessage())
	}
	if err != nil {
		s.errors.Add(err)
		return nil
	}

	return nil
}
