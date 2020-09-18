package scenario

import (
	"context"
	"fmt"
	"net/url"
	"sync"
	"sync/atomic"
	"time"

	"github.com/isucon/isucandar"
	"github.com/isucon/isucandar/failure"
	"github.com/isucon/isucandar/parallel"
	"github.com/isucon/isucandar/random/useragent"
	"github.com/isucon/isucandar/worker"
	"github.com/isucon/isucon10-final/benchmarker/model"
	"github.com/isucon/isucon10-final/benchmarker/proto/xsuportal/resources"
	"github.com/isucon/isucon10-final/benchmarker/proto/xsuportal/services/contestant"
	"github.com/isucon/isucon10-final/benchmarker/random"
)

func (s *Scenario) Load(ctx context.Context, step *isucandar.BenchmarkStep) error {
	wg := sync.WaitGroup{}

	wg.Add(1)
	go func() {
		defer wg.Done()
		if err := s.loadAudienceDashboard(ctx, step); err != nil {
			step.AddError(err)
		}
	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		s.loadBenchmarker(ctx, step)
	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		if err := s.loadAdminClarification(ctx, step); err != nil {
			step.AddError(err)
		}
	}()

	if err := s.loadSignup(ctx, step); err != nil {
		return err
	}

	if len(s.Contest.Teams) == 0 {
		return nil
	}

	<-time.After(s.Contest.ContestStartsAt.Sub(time.Now()))

	wg.Add(1)
	go func() {
		defer wg.Done()
		if err := s.loadEnqueueBenchmark(ctx, step); err != nil {
			step.AddError(err)
		}
	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		if err := s.loadGetDashboard(ctx, step); err != nil {
			step.AddError(err)
		}
	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		if err := s.loadClarification(ctx, step); err != nil {
			step.AddError(err)
		}
	}()

	wg.Wait()

	return nil
}

// 競技者用ベンチマーカーの起動。1チームにつき1ベンチマーカー起動する。
func (s *Scenario) loadBenchmarker(ctx context.Context, step *isucandar.BenchmarkStep) {
	ctx, cancel := context.WithDeadline(ctx, s.Contest.ContestEndsAt)
	defer cancel()

	benchmarkers := parallel.NewParallel(-1)
	s.bpubsub.Subscribe(ctx, func(teamID interface{}) {
		tid := teamID.(int64)
		benchmarker := s.NewBenchmarker(tid)
		benchmarkers.Do(ctx, func(ctx context.Context) {
		P:
			if err := benchmarker.Process(ctx, step); err != nil {
				step.AddError(err)
			}

			if ctx.Err() == nil {
				goto P
			}
		})
	})

	benchmarkers.Do(ctx, func(ctx context.Context) {
		<-ctx.Done()
	})

	benchmarkers.Wait()
}

// 競技者による参加登録
func (s *Scenario) loadSignup(ctx context.Context, step *isucandar.BenchmarkStep) error {
	signupContext, cancel := context.WithDeadline(ctx, s.Contest.ContestStartsAt.Add(-1*time.Second))
	defer cancel()

	stopSignup := uint32(0)

	w, err := worker.NewWorker(func(ctx context.Context, _ int) {
		if atomic.LoadUint32(&stopSignup) > 0 {
			return
		}

		baseURL, err := url.Parse(s.BaseURL)
		if err != nil {
			step.AddError(err)
			return
		}

		team, err := model.NewTeam()
		if err != nil {
			step.AddError(err)
			return
		}

		if ctx.Err() != nil {
			return
		}

		team.Leader.Agent.BaseURL = baseURL
		team.Leader.Agent.Name = useragent.Chrome()
		team.Operator.Agent.BaseURL = baseURL
		team.Operator.Agent.Name = useragent.Firefox()
		team.Developer.Agent.BaseURL = baseURL
		team.Developer.Agent.Name = useragent.Edge()

		lead := team.Leader
		ops := team.Operator
		dev := team.Developer
		team.Operator = team.Leader
		team.Developer = team.Leader

		_, _, err = BrowserAccess(ctx, lead, "/signup")
		if err != nil {
			step.AddError(err)
			return
		}
		// TODO: Check browser access

		if ctx.Err() != nil {
			return
		}

		if ctx.Err() != nil {
			return
		}

		_, err = SignupAction(ctx, lead)
		if err != nil {
			step.AddError(err)
			return
		}
		// TODO: Check signup

		createTeam, err := CreateTeamAction(ctx, team, lead)
		if err != nil {
			if failure.IsCode(err, ErrX403) {
				atomic.StoreUint32(&stopSignup, 1)
				return
			}
			step.AddError(err)
			return
		}

		team.ID = createTeam.GetTeamId()
		s.Contest.AddTeam(team)
		s.AddBenchmarker(team.ID)

		step.AddScore("create-team")

		registration, err := GetRegistrationSession(ctx, lead)
		if err != nil {
			step.AddError(err)
			return
		}

		memberInviteURL := registration.GetMemberInviteUrl()
		inviteToken := registration.GetInviteToken()

		signupMember := func(member *model.Contestant, role string) func(context.Context) {
			return func(ctx context.Context) {
				_, _, err = BrowserAccess(ctx, member, "/signup")
				if err != nil {
					step.AddError(err)
					return
				}
				// TODO: Check browser access

				if ctx.Err() != nil {
					return
				}

				if ctx.Err() != nil {
					return
				}

				_, err = SignupAction(ctx, member)
				if err != nil {
					step.AddError(err)
					return
				}
				// TODO: Check signup

				_, _, err = BrowserAccess(ctx, member, memberInviteURL)
				if err != nil {
					step.AddError(err)
					return
				}

				_, err = JoinTeamAction(ctx, team, member, inviteToken)
				if err != nil {
					step.AddError(err)
					return
				}

				step.AddScore("join-member")

				switch role {
				case "dev":
					team.Developer = member
				case "ops":
					team.Operator = member
				}
			}
		}

		para := parallel.NewParallel(2)

		para.Do(ctx, signupMember(dev, "dev"))
		para.Do(ctx, signupMember(ops, "ops"))

		para.Wait()
	}, worker.WithInfinityLoop())
	if err != nil {
		return err
	}

	if s.TeamCapacity > 0 {
		w.SetLoopCount(s.TeamCapacity)
	}
	// TODO: 並列数は要検討
	w.SetParallelism(20)

	w.Process(signupContext)

	return nil
}

// 競技者によるベンチマークの開始。
func (s *Scenario) loadEnqueueBenchmark(ctx context.Context, step *isucandar.BenchmarkStep) error {
	ctx, cancel := context.WithDeadline(ctx, s.Contest.ContestEndsAt.Add(-1*time.Second))
	defer cancel()

	w, err := worker.NewWorker(func(ctx context.Context, index int) {
		team := s.Contest.Teams[index]

		for ctx.Err() == nil {
			if job := team.GetLatestEnqueuedBenchmarkJob(); job != nil {
				continue
			}

			// ダッシュボード開いてキューを積むのでブラウザアクセスとダッシュボード的 API 呼び出しを含む
			BrowserAccess(ctx, team.Developer, "/contestant/dashboard")
			go GetDashboardAction(ctx, team, team.Developer)
			go GetBenchmarkJobs(ctx, team, team.Developer)

			if ctx.Err() != nil {
				return
			}

			job, err := EnqueueBenchmarkJobAction(ctx, team)
			if err != nil {
				if failure.Is(err, context.Canceled) || failure.Is(err, context.DeadlineExceeded) {
					return
				}
				step.AddError(fmt.Errorf("%v: Team: %d", err, team.ID))
				continue
			}

			team.Enqueued(job)
			step.AddScore("enqueue-benchmark")

			s.loadWaitBenchmark(ctx, step, team, job)
		}
	}, worker.WithLoopCount(int32(len(s.Contest.Teams))))
	if err != nil {
		return failure.NewError(ErrScenarioCretical, err)
	}

	w.Process(ctx)

	return nil
}

// 競技者によるベンチマーク実行待ちの処理。自動更新1秒間隔。
// 結果出力後に詳細を見る。
func (s *Scenario) loadWaitBenchmark(ctx context.Context, step *isucandar.BenchmarkStep, team *model.Team, job *contestant.EnqueueBenchmarkJobResponse) {
	for ctx.Err() == nil {
		timer := time.After(1 * time.Second)
		res, err := GetBenchmarkJobs(ctx, team, team.Developer)
		if err != nil {
			step.AddError(err)
		}
		jobs := res.GetJobs()
		if len(jobs) > 0 {
			latestJob := jobs[0]
			if latestJob.GetId() == job.GetJob().GetId() && (latestJob.GetStatus() == resources.BenchmarkJob_ERRORED || latestJob.GetStatus() == resources.BenchmarkJob_FINISHED) {
				_, err := GetBenchmarkJobAction(ctx, job.GetJob().GetId(), team.Developer)
				if err != nil {
					step.AddError(err)
					break
				}

				team.Enqueued(nil)
				step.AddScore("finish-benchmark")
				s.AddAudience(1)
				break
			}
		}
		<-timer
	}
}

// 競技者によるダッシュボードの閲覧。自動更新1秒で取得を続ける。
func (s *Scenario) loadGetDashboard(ctx context.Context, step *isucandar.BenchmarkStep) error {
	ctx, cancel := context.WithDeadline(ctx, s.Contest.ContestEndsAt)
	defer cancel()

	w, err := worker.NewWorker(func(ctx context.Context, index int) {
		team := s.Contest.Teams[index]

		_, _, err := BrowserAccess(ctx, team.Operator, "/contestant/dashboard")
		if err != nil {
			step.AddError(err)
			return
		}

		for ctx.Err() == nil {
			timer := time.After(1 * time.Second)
			wg := sync.WaitGroup{}
			wg.Add(2)

			failed := uint32(0)
			go func() {
				defer wg.Done()
				_, err := GetDashboardAction(ctx, team, team.Operator)
				if err != nil {
					step.AddError(err)
					atomic.StoreUint32(&failed, 1)
					return
				}
			}()

			go func() {
				defer wg.Done()
				_, err := GetBenchmarkJobs(ctx, team, team.Operator)
				if err != nil {
					step.AddError(err)
					atomic.StoreUint32(&failed, 1)
					return
				}
			}()

			wg.Wait()

			if atomic.LoadUint32(&failed) == 0 {
				step.AddScore("get-dashboard")
			}

			<-timer
		}
	}, worker.WithLoopCount(int32(len(s.Contest.Teams))))
	if err != nil {
		return failure.NewError(ErrScenarioCretical, err)
	}

	w.Process(ctx)

	return nil
}

// 競技者による Clar のチェックと送信。最後の Clar 送信から規定秒数経過すると、 Clar の未回答を気にせずに次の Clar を送信する。
// Clar には自動更新がないのでこちらもブラウザリロード
func (s *Scenario) loadClarification(ctx context.Context, step *isucandar.BenchmarkStep) error {
	ctx, cancel := context.WithDeadline(ctx, s.Contest.ContestEndsAt.Add(-5*time.Second))
	defer cancel()

	w, err := worker.NewWorker(func(ctx context.Context, index int) {
		team := s.Contest.Teams[index]
		leader := team.Leader

		latestClarPostedAt := time.Now()

		for ctx.Err() == nil {
			timer := time.After(1 * time.Second)
			_, _, err := BrowserAccess(ctx, leader, "/contestant/clarifications")
			if err != nil {
				step.AddError(err)
				continue
			}
			_, err = GetClarificationsAction(ctx, leader)
			if err != nil {
				step.AddError(err)
				continue
			}
			step.AddScore("get-clarification")

			if time.Now().After(latestClarPostedAt.Add(3 * time.Second)) {
				_, err := PostClarificationAction(ctx, leader, random.Question())
				if err != nil {
					step.AddError(err)
					continue
				}
				latestClarPostedAt = time.Now()
				step.AddScore("post-clarification")
			}

			<-timer
		}
	}, worker.WithLoopCount(int32(len(s.Contest.Teams))))
	if err != nil {
		return failure.NewError(ErrScenarioCretical, err)
	}

	w.Process(ctx)

	return nil
}

// 管理者による Clar のチェックと解答。Clar には自動更新がないのでブラウザリロードを毎回行っている。
func (s *Scenario) loadAdminClarification(ctx context.Context, step *isucandar.BenchmarkStep) error {
	ctx, cancel := context.WithDeadline(ctx, s.Contest.ContestEndsAt.Add(-5*time.Second))
	defer cancel()

	admin, err := model.NewAdmin()
	if err != nil {
		return err
	}
	admin.Agent.BaseURL, _ = url.Parse(s.BaseURL)
	admin.Agent.Name = useragent.Chrome()

	_, err = LoginAction(ctx, admin)
	if err != nil {
		return err
	}

	w, err := worker.NewWorker(func(ctx context.Context, index int) {
		for ctx.Err() == nil {
			timer := time.After(200 * time.Millisecond)

			_, _, err := BrowserAccess(ctx, admin, "/admin/clarifications")
			if err != nil {
				step.AddError(err)
				continue
			}
			res, err := AdminGetClarificationsAction(ctx, admin)
			if err != nil {
				step.AddError(err)
				continue
			}
			step.AddScore("admin-get-clarifications")

			wg := sync.WaitGroup{}
			for _, clar := range res.GetClarifications() {
				if clar.GetAnswered() {
					continue
				}

				wg.Add(1)
				go func(clar *resources.Clarification) {
					defer wg.Done()

					_, err := AdminGetClarificationAction(ctx, clar.GetId(), admin)
					if err != nil {
						step.AddError(err)
						return
					}
					step.AddScore("admin-get-clarification")

					_, err = AdminPostClarificationAction(ctx, clar.GetId(), admin, random.Answer())
					if err != nil {
						step.AddError(err)
						return
					}
					step.AddScore("admin-answer-clarification")
				}(clar)
			}

			wg.Wait()

			<-timer
		}
	}, worker.WithInfinityLoop(), worker.WithMaxParallelism(1))
	if err != nil {
		return failure.NewError(ErrScenarioCretical, err)
	}

	w.Process(ctx)

	return nil
}

// 外部参加者によるダッシュボードの閲覧。 pubsub で増える。
func (s *Scenario) loadAudienceDashboard(ctx context.Context, step *isucandar.BenchmarkStep) error {
	ctx, cancel := context.WithDeadline(ctx, s.Contest.ContestEndsAt)
	defer cancel()

	audience := parallel.NewParallel(-1)
	audienceLoad := func(ctx context.Context) {
		viewer, err := s.NewAgent()
		if err != nil {
			step.AddError(err)
			return
		}

		viewer.Name = useragent.Chrome()

		_, _, err = BrowserAccessGuest(ctx, viewer, "/")
		if err != nil {
			step.AddError(err)
			return
		}

		for ctx.Err() == nil {
			timer := time.After(1 * time.Second)

			_, err := AudienceGetDashboardAction(ctx, viewer)
			if err != nil {
				step.AddError(err)
				return
			}
			step.AddScore("audience-get-dashboard")

			<-timer
		}
	}

	s.rpubsub.Subscribe(ctx, func(_ interface{}) {
		audience.Do(ctx, audienceLoad)
	})

	audience.Do(ctx, func(ctx context.Context) {
		<-ctx.Done()
	})

	audience.Wait()

	return nil
}
