package story

import (
	"context"
	"fmt"
	"github.com/isucon/isucon10-final/benchmarker/failure"
	"github.com/isucon/isucon10-final/benchmarker/model"
	"github.com/isucon/isucon10-final/benchmarker/session"
	"sort"
	"sync"
	"time"
)

func (s *Story) Main(ctx context.Context) error {
	defer func() {
		if err := recover(); err != nil {
			s.errors.Add(failure.New(failure.ErrCritical, fmt.Sprintf("%+v", err)))
		}
	}()

	s.stdoutLogger.Info().Msg("Start main check")

	if err := s.initialize(ctx); err != nil {
		s.errors.Add(err)
		return nil
	}

	s.registration(ctx)

	// s.makeBenchmarkers(ctx)

	startTimer := time.After(s.contest.ContestStartsAt.Sub(time.Now()))
	<-startTimer

	bctx, cancel := context.WithCancel(ctx)
	go s.executeBenchmarkers(bctx)
	go func(bctx context.Context) {
		for {
			s.enqueueBenchmark(bctx)
			select {
			case <-time.After(10 * time.Millisecond):
			case <-bctx.Done():
				return
			}
		}
	}(bctx)

	go func(bctx context.Context) {
		for {
			s.getDashboard(bctx)
			select {
			case <-time.After(1 * time.Second):
			case <-bctx.Done():
				return
			}
		}
	}(bctx)

	go func(bctx context.Context) {
		for {
			s.listBenchmark(bctx)
			select {
			case <-time.After(1 * time.Second):
			case <-bctx.Done():
				return
			}
		}
	}(bctx)

	<-time.After(s.contest.ContestEndsAt.Sub(time.Now()))
	cancel()

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
		s.contest.GRPCHost = benchmarkServer.GetHost()
		s.contest.GRPCPort = benchmarkServer.GetPort()
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
		return failure.New(failure.ErrCritical, "initialize に失敗しました")
	}

	return nil
}

func (s *Story) registration(ctx context.Context) {
	ctx, cancel := context.WithCancel(ctx)
	defer cancel()

	now := time.Now()
	timer := time.After(s.contest.ContestStartsAt.Sub(now) - 1*time.Second)

	// TODO: 20並列で登録だなんだのリクエストを送りつけてるけど、これ80ぐらいにすると通らない
	parallelism := make(chan bool, 40)
	wg := &sync.WaitGroup{}
	// execute := true

	go func() {
		<-timer
		close(parallelism)
	}()

	wg.Add(1)
	go func() {
		defer func() {
			if r := recover(); r != nil {
				return
			}
		}()

		defer wg.Done()
		for {
			parallelism <- true
			wg.Add(1)
			go func() {
				defer wg.Done()
				if err := s.registerTeam(ctx); err == nil {
				}
				<-parallelism
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
			return failure.New(failure.ErrApplication, "チーム登録に失敗しました")
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

	s.Scores.CreateTeam.Incr()

	inviteToken := registrationSession.GetInviteToken()

	if ok, _ := s.joinTeam(ctx, inviteToken, team, team.Developer); !ok {
		team.Developer = team.Leader
	}
	if ok, _ := s.joinTeam(ctx, inviteToken, team, team.Operator); !ok {
		team.Operator = team.Leader
	}

	return nil
}

func (s *Story) joinTeam(ctx context.Context, inviteToken string, team *model.Team, contestant *model.Contestant) (bool, error) {
	if team.Leader.ID == contestant.ID {
		return false, nil
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
		return false, nil
	}

	_, xerr, err = browser.LoginAction(ctx)
	if xerr != nil {
		err = failure.New(failure.ErrApplication, xerr.GetHumanMessage())
	}
	if err != nil {
		s.errors.Add(err)
		return false, nil
	}

	_, xerr, err = browser.JoinTeam(ctx, team, inviteToken)
	if xerr != nil {
		if xerr.GetCode() == 403 {
			return false, nil
		}
		err = failure.New(failure.ErrApplication, xerr.GetHumanMessage())
	}
	if err != nil {
		s.errors.Add(err)
		return false, nil
	}

	return true, nil
}

func (s *Story) makeBenchmarkers(ctx context.Context) error {
	for _, team := range s.contest.Teams {
		bench, err := session.NewBenchmarker(team, s.contest.GRPCHost, s.contest.GRPCPort)
		if err != nil {
			return err
		}
		s.benchmarkPool.Put(bench)
	}
	return nil
}

func (s *Story) enqueueBenchmark(ctx context.Context) error {
	wg := &sync.WaitGroup{}
	parallelism := make(chan bool, len(s.contest.Teams))

	for _, team := range s.contest.Teams {
		wg.Add(1)
		parallelism <- true
		go func(team *model.Team) {
			defer wg.Done()
			defer func() { <-parallelism }()

			team.Lock.Lock()
			defer team.Lock.Unlock()

			if team.LatestEnqueuedBenchmarkJob != nil {
				return
			}

			browser := s.browserPool.Get().(*session.Browser)
			defer s.browserPool.Put(browser)

			browser.Contestant = team.Developer

			job, xerr, err := browser.EnqueueBenchmarkJob(ctx, team)
			if xerr != nil {
				if xerr.GetCode() == 403 {
					return
				}
				err = failure.New(failure.ErrApplication, xerr.GetHumanMessage())
			}
			if err != nil {
				s.errors.Add(err)
				return
			}

			jobId := job.GetJob().GetId()
			s.teamByJobID[jobId] = team
			team.LatestEnqueuedBenchmarkJob = job
			s.Scores.FinishBenchmark.Incr()
		}(team)
	}

	wg.Wait()

	return nil
}

func (s *Story) executeBenchmarkers(ctx context.Context) {
	now := time.Now()
	startedAt := now
	finishedAt := s.contest.ContestEndsAt
	duration := finishedAt.Sub(startedAt)

	endTimer := time.After(s.contest.ContestEndsAt.Sub(now))
	parallelism := make(chan bool, s.benchmarkParalellism)

	go func() {
		defer func() {
			if err := recover(); err != nil {
				return
			}
		}()

		for {
			benchmarker := s.benchmarkPool.Get().(*session.Benchmarker)
			parallelism <- true
			go func() {
				defer s.benchmarkPool.Put(benchmarker)
				defer func() { <-parallelism }()
				nowDuration := finishedAt.Sub(time.Now())
				nowIndex := 100 - int64((float64(nowDuration)/float64(duration))*100)

				result, err := benchmarker.Do(ctx, nowIndex, nil)
				if err == nil && result != nil {
					if team, ok := s.teamByJobID[result.GetJobId()]; ok {
						team.AddScore(result)

						s.verifyLeaderboard(ctx, team, true)
					}
				}
			}()
		}
	}()

	<-endTimer
	close(parallelism)
}

func (s *Story) getDashboard(ctx context.Context) {
	wg := &sync.WaitGroup{}

	for _, team := range s.contest.Teams {
		wg.Add(1)
		go func(team *model.Team) {
			defer wg.Done()

			s.verifyLeaderboard(ctx, team, false)
		}(team)
	}

	wg.Wait()
}

func (s *Story) verifyLeaderboard(ctx context.Context, team *model.Team, verifyScore bool) {
	team.Lock.Lock()
	defer team.Lock.Unlock()

	errored := false

	defer func() {
		if !errored {
			if verifyScore {
				s.Scores.GetDashboardByDeveloper.Incr()
			} else {
				s.Scores.GetDashboardByOperator.Incr()
			}
		}
	}()

	browser := s.browserPool.Get().(*session.Browser)
	browser.Contestant = team.Operator

	res, xerr, err := browser.Dashboard(ctx)
	if xerr != nil {
		err = failure.New(failure.ErrApplication, xerr.GetHumanMessage())
	}
	if err != nil {
		errored = true
		s.errors.Add(err)
	}

	leaderboard := res.GetLeaderboard()

	// リーダーボードのソート順が正確か検証する
	teams := leaderboard.GetTeams()
	sorted := sort.SliceIsSorted(teams, func(i int, j int) bool {
		a := teams[i]
		aLatest := a.GetLatestScore()
		b := teams[j]
		bLatest := b.GetLatestScore()

		if aLatest.GetScore() == 0 && bLatest.GetScore() == 0 {
			return false
		}

		if aLatest.GetScore() == bLatest.GetScore() {
			return bLatest.GetMarkedAt().AsTime().After(aLatest.GetMarkedAt().AsTime())
		}
		return aLatest.GetScore() > bLatest.GetScore()
	})
	if !sorted {
		errored = true
		s.errors.Add(failure.New(failure.ErrApplication, "リーダーボードのソート順が間違っています"))
	}

	if !verifyScore {
		return
	}

	// 自分のチームの最新スコアと最高スコアとスコアグラフが正しいかを検証する
	for _, t := range teams {
		if t.GetTeam().GetId() == team.ID {
			if t.GetLatestScore().GetScore() != team.LatestScore {
				errored = true
				s.stderrLogger.Error().Int64("TeamID", team.ID).Int64("expected", team.LatestScore).Int64("actual", t.GetLatestScore().GetScore()).Msg("最終スコアの検証失敗")
				s.errors.Add(failure.New(failure.ErrApplication, "最終スコアの検証に失敗しました"))
			}
			if t.GetBestScore().GetScore() != team.BestScore {
				errored = true
				s.stderrLogger.Error().Int64("TeamID", team.ID).Int64("expected", team.BestScore).Int64("actual", t.GetBestScore().GetScore()).Msg("ベストスコアの検証失敗")
				s.errors.Add(failure.New(failure.ErrApplication, "ベストスコアの検証に失敗しました"))
			}

			if len(t.GetScores()) != len(team.Scores) {
				errored = true
				s.stderrLogger.Error().Int64("TeamID", team.ID).Int("expected", len(team.Scores)).Int("actual", len(t.GetScores())).Msg("スコアグラフエントリ数不一致")
				s.errors.Add(failure.New(failure.ErrApplication, "スコアグラフの検証に失敗しました"))
			} else {
				for idx, sc := range t.GetScores() {
					score := team.Scores[idx]
					if sc.GetScore() != score.GetResult().GetScore() {
						errored = true
						s.stderrLogger.Error().Int64("TeamID", team.ID).Int64("expected", score.GetResult().GetScore()).Int64("actual", sc.GetScore()).Msg("スコアグラフエントリの不一致")
						s.errors.Add(failure.New(failure.ErrApplication, "スコアグラフの検証に失敗しました"))
					}
				}
			}

			break
		}
	}
}

func (s *Story) listBenchmark(ctx context.Context) {
	wg := &sync.WaitGroup{}

	for _, team := range s.contest.Teams {
		wg.Add(1)
		go func(team *model.Team) {
			defer wg.Done()

			browser := s.browserPool.Get().(*session.Browser)
			browser.Contestant = team.Leader

			res, xerr, err := browser.ListBenchmarkJobs(ctx)
			if xerr != nil {
				err = failure.New(failure.ErrApplication, xerr.GetHumanMessage())
			}
			if err != nil {
				s.errors.Add(err)
				return
			}

			errored := false
			jobs := res.GetJobs()
			sorted := sort.SliceIsSorted(jobs, func(i int, j int) bool {
				a := jobs[i]
				b := jobs[j]
				return a.GetCreatedAt().AsTime().After(b.GetCreatedAt().AsTime())
			})
			if !sorted {
				errored = true
				s.errors.Add(failure.New(failure.ErrApplication, "ベンチマークジョブリストの並び順が不正です"))
			}

			for _, job := range jobs {
				for _, score := range team.Scores {
					if score.GetJobId() == job.GetId() {
						if score.GetResult().String() != job.GetResult().String() {
							s.stderrLogger.Error().Int64("TeamID", team.ID).Str("expected", score.GetResult().String()).Str("actual", job.GetResult().String()).Msg("ベンチマークリストジョブ詳細不一致")
							errored = true
							s.errors.Add(failure.New(failure.ErrApplication, "ベンチマーク結果が期待と一致しません"))
						}
					}
				}
			}

			if !errored {
				s.Scores.GetListBenchmarks.Incr()
			}
		}(team)
	}

	wg.Wait()
}
