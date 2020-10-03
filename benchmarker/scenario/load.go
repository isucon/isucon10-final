package scenario

import (
	"context"
	"encoding/base64"
	"fmt"
	"math/rand"
	"net/url"
	"sync"
	"sync/atomic"
	"time"

	"github.com/golang/protobuf/proto"
	"github.com/hashicorp/golang-lru/simplelru"
	"github.com/isucon/isucandar"
	"github.com/isucon/isucandar/failure"
	"github.com/isucon/isucandar/parallel"
	"github.com/isucon/isucandar/random/useragent"
	"github.com/isucon/isucandar/worker"
	"github.com/isucon/isucon10-final/benchmarker/model"
	"github.com/isucon/isucon10-final/benchmarker/proto/xsuportal/resources"
	"github.com/isucon/isucon10-final/benchmarker/proto/xsuportal/services/common"
	"github.com/isucon/isucon10-final/benchmarker/pushserver"
)

func (s *Scenario) Load(parent context.Context, step *isucandar.BenchmarkStep) error {
	if s.NoLoad {
		return nil
	}
	ctx, cancel := context.WithCancel(parent)
	defer cancel()

	ContestantLogger.Printf("===> LOAD")
	AdminLogger.Printf("LOAD INFO\n  Registration Open at: %s\n  Contest Start at: %s\n  Contest Freeze at: %s\n  Contest Ends at: %s\n", s.Contest.RegistrationOpenAt, s.Contest.ContestStartsAt, s.Contest.ContestFreezesAt, s.Contest.ContestEndsAt)
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

	<-time.After(s.Contest.RegistrationOpenAt.Sub(time.Now()))

	if err := s.loadSignup(ctx, step); err != nil {
		return err
	}

	if len(s.Contest.Teams) == 0 {
		step.AddError(failure.NewError(ErrCritical, fmt.Errorf("チームが1つも登録できませんでした")))
		return nil
	}

	nonClarTeamCount := len(s.Contest.Teams) / 4
	for i := 0; i < nonClarTeamCount; i++ {
		team := s.Contest.Teams[rand.Intn(len(s.Contest.Teams))]
		if team.NonClarification {
			i--
			continue
		} else {
			team.NonClarification = true
		}
	}

	<-time.After(s.Contest.ContestStartsAt.Sub(time.Now()))
	s.Mark(time.Now().UTC())

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

	<-time.After(s.Contest.ContestEndsAt.Add(5 * time.Second).Sub(time.Now()))

	return nil
}

// 競技者用ベンチマーカーの起動。1チームにつき1ベンチマーカー起動する。
func (s *Scenario) loadBenchmarker(ctx context.Context, step *isucandar.BenchmarkStep) {
	ctx, cancel := context.WithDeadline(ctx, s.Contest.ContestEndsAt)
	defer cancel()

	benchmarkers := parallel.NewParallel(ctx, -1)
	s.bpubsub.Subscribe(ctx, func(teamID interface{}) {
		tid := teamID.(int64)
		benchmarker := s.NewBenchmarker(tid)
		benchmarkers.Do(func(ctx context.Context) {
			for {
				if err := benchmarker.Process(ctx, step); err != nil {
					step.AddError(err)
				}

				select {
				case <-ctx.Done():
					return
				default:
				}
			}
		})
	})

	benchmarkers.Do(func(ctx context.Context) {
		<-ctx.Done()
	})

	benchmarkers.Wait()
}

// 競技者による参加登録
func (s *Scenario) loadSignup(parent context.Context, step *isucandar.BenchmarkStep) error {
	signupContext, cancel := context.WithDeadline(parent, s.Contest.ContestStartsAt.Add(-1*time.Second))
	defer cancel()

	stopSignup := uint32(0)
	firstSignup := uint32(0)

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

		if atomic.CompareAndSwapUint32(&firstSignup, 0, 1) {
			lead.ID = "isucon1"
			lead.Password = "isucon1"
			lead.Name = "isucon1"
			dev.ID = "isucon2"
			dev.Password = "isucon2"
			dev.Name = "isucon2"
			ops.ID = "isucon3"
			ops.Password = "isucon3"
			ops.Name = "isucon3"
		}

		res, resources, session, err := BrowserAccess(ctx, lead, "/signup")
		if err != nil {
			step.AddError(err)
			return
		}

		errs := verifyResources("signup", res, resources)
		for _, err := range errs {
			step.AddError(err)
		}
		if len(errs) > 0 {
			return
		}

		sres, _, err := SignupAction(ctx, lead)
		if err != nil {
			step.AddError(err)
			return
		}

		if sres == nil {
			step.AddError(errorInvalidResponse("選手登録でエラーが発生しました"))
			return
		}

		createTeam, chres, err := CreateTeamAction(ctx, team, lead)
		if err != nil {
			if failure.IsCode(err, ErrX403) {
				atomic.StoreUint32(&stopSignup, 1)
			} else {
				step.AddError(err)
			}
			return
		}
		if chres.StatusCode == 403 {
			atomic.StoreUint32(&stopSignup, 1)
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

		// 本来であれば dashboard に到達してから subscribe ボタンを押下して実施される流れなので、dashboard の時にとった session を利用したい ~sorah
		// あきらめる ~rosylilly
		go s.watchNotifications(parent, step, team, team.Leader, session)

		signupMember := func(member *model.Contestant, role string) func(context.Context) {
			return func(ctx context.Context) {
				res, resources, session, err := BrowserAccess(ctx, member, "/signup")
				if err != nil {
					step.AddError(err)
					return
				}

				errs := verifyResources("audience", res, resources)
				for _, err := range errs {
					step.AddError(err)
				}
				if len(errs) > 0 {
					return
				}

				_, sres, err := SignupAction(ctx, member)
				if err != nil {
					step.AddError(err)
					return
				}

				if err := verifyResponseCode(sres, []int{200}); err != nil {
					step.AddError(err)
					return
				}

				res, resources, _, err = BrowserAccess(ctx, member, memberInviteURL)
				if err != nil {
					step.AddError(err)
					return
				}

				errs = verifyResources("audience", res, resources)
				for _, err := range errs {
					step.AddError(err)
				}
				if len(errs) > 0 {
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

				// 本来であれば dashboard に到達してから subscribe ボタンを押下して実施される流れなので、dashboard の時にとった session を利用したい ~sorah
				// あきらめる ~rosylilly
				go s.watchNotifications(parent, step, team, member, session)
			}
		}

		para := parallel.NewParallel(ctx, 2)

		para.Do(signupMember(dev, "dev"))
		para.Do(signupMember(ops, "ops"))

		para.Wait()
	}, worker.WithInfinityLoop())
	if err != nil {
		return err
	}

	if s.TeamCapacity > 0 {
		w.SetLoopCount(s.TeamCapacity)
	}

	w.SetParallelism(20)
	go func(ctx context.Context, w *worker.Worker) {
		for {
			timer := time.After(1 * time.Second)

			w.AddParallelism(10)

			select {
			case <-ctx.Done():
				return
			case <-timer:
			}
		}
	}(signupContext, w)

	w.Process(signupContext)

	return nil
}

func (s *Scenario) isContestEnd() bool {
	now := time.Now()
	ends := s.Contest.ContestEndsAt.Add(-500 * time.Millisecond)
	return now.After(ends) || now.Equal(ends)
}

// 競技者によるベンチマークの開始。
func (s *Scenario) loadEnqueueBenchmark(ctx context.Context, step *isucandar.BenchmarkStep) error {
	ctx, cancel := context.WithDeadline(ctx, s.Contest.ContestEndsAt.Add(5*time.Second))
	defer cancel()

	w, err := worker.NewWorker(func(ctx context.Context, index int) {
		team := s.Contest.Teams[index]

		for ctx.Err() == nil {
			select {
			case <-ctx.Done():
				return
			case team.EnqueueLock <- struct{}{}:
			}

			// すべての Clar の解決を待つ
			<-team.WaitAllClarResolve(ctx)

			if s.isContestEnd() {
				<-ctx.Done()
				return
			}

			// ダッシュボード開いてキューを積むのでブラウザアクセスとダッシュボード的 API 呼び出しを含む
			res, resources, session, err := BrowserAccess(ctx, team.Developer, "/contestant")
			if err != nil {
				go func() { <-team.EnqueueLock }()
				step.AddError(err)
				<-time.After(100 * time.Millisecond)
				continue
			}

			errs := verifyResources("contestant", res, resources)
			for _, err := range errs {
				step.AddError(err)
			}
			if len(errs) > 0 {
				go func() { <-team.EnqueueLock }()
				<-time.After(100 * time.Millisecond)
				continue
			}

			if err := s.verifySession(session, team, team.Developer); err != nil {
				step.AddError(err)
				return
			}

			if s.isContestEnd() {
				<-ctx.Done()
				return
			}

			go GetDashboardAction(ctx, team, team.Developer, 2*time.Second)
			go GetBenchmarkJobs(ctx, team, team.Developer)

			if s.isContestEnd() {
				<-ctx.Done()
				return
			}

			job, err := EnqueueBenchmarkJobAction(ctx, team)
			if err != nil {
				if failure.IsCode(err, ErrScenarioCancel) {
					return
				}
				go func() { <-team.EnqueueLock }()
				step.AddError(err)
				<-time.After(100 * time.Millisecond)
				continue
			}

			team.Enqueued(job)
			step.AddScore("enqueue-benchmark")
		}
	}, worker.WithLoopCount(int32(len(s.Contest.Teams))))
	if err != nil {
		return failure.NewError(ErrScenarioCretical, err)
	}

	w.Process(ctx)

	return nil
}

// 競技者によるダッシュボードの閲覧。自動更新1秒で取得を続ける。
func (s *Scenario) loadGetDashboard(ctx context.Context, step *isucandar.BenchmarkStep) error {
	ctx, cancel := context.WithDeadline(ctx, s.Contest.ContestEndsAt)
	defer cancel()

	w, err := worker.NewWorker(func(ctx context.Context, index int) {
		team := s.Contest.Teams[index]

		res, resources, session, err := BrowserAccess(ctx, team.Operator, "/contestant")
		if err != nil {
			step.AddError(err)
			return
		}

		errs := verifyResources("contestant", res, resources)
		for _, err := range errs {
			step.AddError(err)
		}
		if len(errs) > 0 {
			return
		}

		if err := s.verifySession(session, team, team.Operator); err != nil {
			step.AddError(err)
			return
		}

		for ctx.Err() == nil {
			if s.isContestEnd() {
				<-ctx.Done()
				return
			}

			timer := time.After(1 * time.Second)
			wg := sync.WaitGroup{}
			wg.Add(2)

			failed := uint32(0)
			go func() {
				defer wg.Done()

				requestedAt := time.Now().UTC()
				latestMarkedAt := s.LatestMarkedAt()
				hres, res, err := GetDashboardAction(ctx, team, team.Operator, 2*time.Second)
				if err != nil {
					step.AddError(err)
					atomic.StoreUint32(&failed, 1)
					return
				}

				if err := s.verifyLeaderboard(requestedAt, res.GetLeaderboard(), hres, s.Contest, team, latestMarkedAt, false); err != nil {
					step.AddError(err)
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

// 競技者による Clar の送信。既に送信していて未回答の Clar がある場合は追加で送信は行わない。
// Clar には自動更新がないのでこちらもブラウザリロード
func (s *Scenario) loadClarification(ctx context.Context, step *isucandar.BenchmarkStep) error {
	ctx, cancel := context.WithDeadline(ctx, s.Contest.ContestEndsAt.Add(5*time.Second))
	defer cancel()

	w, err := worker.NewWorker(func(ctx context.Context, index int) {
		team := s.Contest.Teams[index]
		// Clar をまったく送信しないチームは早期脱落
		if team.NonClarification || s.NoClar {
			return
		}

		leader := team.Leader

		latestClarPostedAt := time.Now()

		for ctx.Err() == nil {
			if s.isContestEnd() {
				<-ctx.Done()
				return
			}

			if time.Now().After(latestClarPostedAt.Add(3 * time.Second)) {
				page, resources, session, err := BrowserAccess(ctx, leader, "/contestant/clarifications")
				if err != nil {
					step.AddError(err)
					<-time.After(100 * time.Millisecond)
					continue
				}

				errs := verifyResources("contestant", page, resources)
				for _, err := range errs {
					step.AddError(err)
				}
				if len(errs) > 0 {
					<-time.After(100 * time.Millisecond)
					continue
				}

				if err := s.verifySession(session, team, team.Leader); err != nil {
					step.AddError(err)
					return
				}

				if s.isContestEnd() {
					<-ctx.Done()
					return
				}

				_, err = GetClarificationsAction(ctx, leader)
				if err != nil {
					step.AddError(err)
					<-time.After(100 * time.Millisecond)
					continue
				}
				step.AddScore("get-clarification")

				clar := model.NewClarification(team)
				team.AddClar(clar)
				s.Contest.AddClar(clar)

				now := time.Now().UTC()
				clar.SetCreatedAt(now)
				clar.SetSentAt(now)

				res, err := PostClarificationAction(ctx, leader, clar)
				if err != nil {
					step.AddError(err)
					<-time.After(100 * time.Millisecond)
					continue
				}

				clar.SetID(res.GetClarification().GetId())
				step.AddScore("post-clarification")

				latestClarPostedAt = time.Now()
			}

			select {
			case <-time.After(3 * time.Second):
				<-team.WaitAllClarResolve(ctx)
			case <-ctx.Done():
				return
			}
		}
	}, worker.WithLoopCount(int32(len(s.Contest.Teams))))

	if err != nil {
		return failure.NewError(ErrScenarioCretical, err)
	}

	w.Process(ctx)

	return nil
}

var ErrLoadAdminListClarifications failure.StringCode = "admin-list-clarifications"
var ErrLoadAdminGetClarification failure.StringCode = "admin-get-clarification"

// 管理者による Clar のチェックと解答。Clar には自動更新がないのでブラウザリロードを毎回行っている。
func (s *Scenario) loadAdminClarification(ctx context.Context, step *isucandar.BenchmarkStep) error {
	ctx, cancel := context.WithDeadline(ctx, s.Contest.ContestEndsAt.Add(5*time.Second))
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

	session, err := GetCurrentSession(ctx, admin)
	if err != nil {
		return err
	}

	if !AssertEqual("admin login session", admin.ID, session.GetContestant().GetId()) {
		return failure.NewError(ErrCritical, errorInvalidResponse("管理者としてのログインに失敗しました"))
	}

	if !AssertEqual("admin login session flag", true, session.GetContestant().GetIsStaff()) {
		return failure.NewError(ErrCritical, errorInvalidResponse("管理者としてのログインに失敗しました"))
	}

	w, err := worker.NewWorker(func(ctx context.Context, index int) {
		for ctx.Err() == nil {
			if s.isContestEnd() {
				<-ctx.Done()
				return
			}

			cres, cresources, _, err := BrowserAccess(ctx, admin, "/admin/clarifications")
			if err != nil {
				step.AddError(err)
				<-time.After(100 * time.Millisecond)
				continue
			}

			errs := verifyResources("admin", cres, cresources)
			for _, err := range errs {
				step.AddError(err)
			}
			if len(errs) > 0 {
				<-time.After(100 * time.Millisecond)
				return
			}

			if s.isContestEnd() {
				<-ctx.Done()
				return
			}

			res, err := AdminGetClarificationsAction(ctx, admin)
			if err != nil {
				step.AddError(err)
				<-time.After(100 * time.Millisecond)
				continue
			}
			step.AddScore("admin-get-clarifications")

			resolveCounts := uint32(0)

			wg := sync.WaitGroup{}
			for _, clar := range res.GetClarifications() {
				var cClar *model.Clarification = nil
				team := s.Contest.GetTeam(clar.GetTeamId())
				cClars := team.Clarifications()
				for _, tClar := range cClars {
					if tClar.ID() == clar.GetId() {
						cClar = tClar
						break
					}

					// 期待してる Clar がまだ ID 未設定で質問文が一致しているならその Clar とみなす
					if tClar.ID() == -1 && team.ID == clar.GetTeamId() && !tClar.IsAnswered() && tClar.Question == clar.GetQuestion() {
						tClar.SetID(clar.GetId())
						cClar = tClar
						break
					}
				}

				if cClar == nil {
					AdminLogger.Printf("Clarification not found: ID: %d / Team: %d", clar.GetId(), clar.GetTeamId())
					step.AddError(failure.NewError(ErrLoadAdminListClarifications, errorInvalidResponse("存在しないはずの Clarification です")))
					continue
				}

				if clar.GetAnswered() {
					continue
				}
				resolveCounts++

				if !AssertEqual("Clar Team ID", team.ID, clar.GetTeamId()) {
					step.AddError(failure.NewError(ErrLoadAdminListClarifications, errorInvalidResponse("Clarification のチーム ID が不正です")))
				}

				wg.Add(1)
				go func(clar *model.Clarification) {
					defer wg.Done()

					gRes, err := AdminGetClarificationAction(ctx, clar.ID(), admin)
					if err != nil {
						step.AddError(failure.NewError(ErrLoadAdminGetClarification, err))
						return
					}
					resClar := gRes.GetClarification()

					if !AssertEqual("Clar Team ID", clar.TeamID, resClar.GetTeamId()) {
						step.AddError(failure.NewError(ErrLoadAdminGetClarification, errorInvalidResponse("Clarification のチーム ID が不正です")))
						return
					}

					if !AssertEqual("Clar Question", clar.Question, resClar.GetQuestion()) {
						step.AddError(failure.NewError(ErrLoadAdminGetClarification, errorInvalidResponse("Clarification の質問文が一致しません")))
						return
					}

					step.AddScore("admin-get-clarification")

					clar.SetSentAt(time.Now().UTC())
					_, err = AdminPostClarificationAction(ctx, admin, clar)
					if err != nil {
						step.AddError(err)
						return
					}
					step.AddScore("admin-answer-clarification")
				}(cClar)
			}

			wg.Wait()

			if resolveCounts == 0 {
				timer := time.After(200 * time.Millisecond)
				<-timer
			}
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
	ctx, cancel := context.WithDeadline(ctx, s.Contest.ContestEndsAt.Add(5*time.Second))
	defer cancel()

	audience := parallel.NewParallel(ctx, -1)
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
			if s.isContestEnd() {
				<-ctx.Done()
				return
			}

			requestedAt := time.Now().UTC()
			latestMarkedAt := s.LatestMarkedAt()
			hres, res, err := AudienceGetDashboardAction(ctx, viewer, 2*time.Second)
			if err != nil {
				// オーディエンスはエラーを記録しない
				step.AddError(err)
				return
			}

			if err := s.verifyLeaderboard(requestedAt, res.GetLeaderboard(), hres, s.Contest, nil, latestMarkedAt, true); err != nil {
				// オーディエンスによる計測失敗は考慮しない
				step.AddError(err)
				return
			}

			step.AddScore("audience-get-dashboard")

			select {
			case <-time.After(1 * time.Second):
			case <-ctx.Done():
				return
			}
		}
	}

	s.rpubsub.Subscribe(ctx, func(_ interface{}) {
		audience.Do(audienceLoad)
	})

	audience.Do(func(ctx context.Context) {
		<-ctx.Done()
	})

	audience.Wait()

	return nil
}

func (s *Scenario) watchNotifications(parent context.Context, step *isucandar.BenchmarkStep, team *model.Team, member *model.Contestant, session *common.GetCurrentSessionResponse) {
	ctx, cancel := context.WithDeadline(parent, s.Contest.ContestEndsAt.Add(5*time.Second))
	defer cancel()

	notificationChan := make(chan []*resources.Notification, 32)

	go s.subscribeToPushNotification(parent, step, member, session, notificationChan)
	go s.loadListNotifications(parent, step, team, member, notificationChan)

	idBucket, err := simplelru.NewLRU(256, func(k interface{}, v interface{}) {})
	if err != nil {
		panic(err) // NewLRU errors when passed capacity is negative
	}

	for {
		select {
		case <-ctx.Done():
			return
		case notifications := <-notificationChan:
			if s.isContestEnd() {
				<-ctx.Done()
				return
			}

			maxID := member.LatestNotificationID()
			clars := []*resources.Notification_ClarificationMessage{}

			for _, notification := range notifications {
				id := notification.GetId()
				if idBucket.Contains(id) {
					continue
				}
				if id > maxID {
					member.UpdateLatestNotificationID(id)
				}

				if job := notification.GetContentBenchmarkJob(); job != nil {
					if team.Developer == member {
						s.loadBenchmarkDetails(ctx, step, team, job)
					}
				}

				if clar := notification.GetContentClarification(); clar != nil {
					if team.Leader == member {
						clars = append(clars, clar)
					}
					member.ReceiveClarID(clar.GetClarificationId())
				}
				idBucket.Add(id, true)
			}
			if len(clars) > 0 {
				s.loadCheckClarification(ctx, step, team, clars)
			}
		}
	}
}

var ErrWebPushSubscription failure.StringCode = "webpush-subscription"

func (s *Scenario) subscribeToPushNotification(parent context.Context, step *isucandar.BenchmarkStep, member *model.Contestant, session *common.GetCurrentSessionResponse, channel chan<- []*resources.Notification) {
	ctx, cancel := context.WithDeadline(parent, s.Contest.ContestEndsAt)
	defer cancel()

	vapidKey := session.GetPushVapidKey()
	if len(vapidKey) < 1 {
		return
	}

	sub, err := s.PushService.Subscribe(&pushserver.SubscriptionOption{
		Vapid: vapidKey,
	}, true, true)
	if err != nil {
		step.AddError(failure.NewError(ErrWebPushSubscription, err))
		return
	}
	defer sub.Expire()

	_, hres, err := SubscribeNotification(ctx, member, sub)
	if err != nil {
		step.AddError(failure.NewError(ErrWebPushSubscription, err))
		return
	}

	if hres.StatusCode != 200 {
		return
	}

	for {
		select {
		case <-ctx.Done():
			return
		case message := <-sub.GetChannel():
			b64encodedBody := message.Body
			body := make([]byte, base64.StdEncoding.DecodedLen(len(b64encodedBody)))
			n, err := base64.StdEncoding.Decode(body, b64encodedBody)
			if err != nil {
				s.handleInvalidPush(sub.ID, err, step)
				continue
			}
			notification := &resources.Notification{}
			if err := proto.Unmarshal(body[0:n], notification); err != nil {
				s.handleInvalidPush(sub.ID, err, step)
				continue
			}
			step.AddScore("push-notifications")
			channel <- []*resources.Notification{notification}
		}
	}
}

func (s *Scenario) loadListNotifications(parent context.Context, step *isucandar.BenchmarkStep, team *model.Team, member *model.Contestant, channel chan<- []*resources.Notification) {
	ctx, cancel := context.WithDeadline(parent, s.Contest.ContestEndsAt.Add(5*time.Second))
	defer cancel()

	lastAnsweredClarificationId := int64(0)
	for {
		if s.isContestEnd() {
			<-ctx.Done()
			return
		}

		notifications, err := GetNotifications(ctx, member)
		if err == nil {
			if lastAnsweredClarificationId > notifications.GetLastAnsweredClarificationId() {
				step.AddError(errorInvalidResponse("通知リスト内の最終回答 Clarification ID が不正です"))
				continue
			}
			lastAnsweredClarificationId = notifications.GetLastAnsweredClarificationId()

			step.AddScore("list-notifications")
			channel <- notifications.GetNotifications()
		} else {
			step.AddError(err)
		}

		timer := time.After(300 * time.Millisecond)
		select {
		case <-ctx.Done():
			return
		case <-timer:
		}
	}
}

var ErrBenchamrkJobDetail failure.StringCode = "get-benchmark-job"

func (s *Scenario) loadBenchmarkDetails(ctx context.Context, step *isucandar.BenchmarkStep, team *model.Team, job *resources.Notification_BenchmarkJobMessage) {
	result := team.GetWaitingBenchmarkResult()
	if result == nil {
		return
	}

	res, err := GetBenchmarkJobAction(ctx, job.GetBenchmarkJobId(), team.Developer)
	if err != nil {
		step.AddError(failure.NewError(ErrBenchamrkJobDetail, err))
		return
	}

	defer func() { <-team.EnqueueLock }()

	err = verifyGetBenchmarkJobDetail(res, team, result)
	if err != nil {
		step.AddError(failure.NewError(ErrBenchamrkJobDetail, err))
		return
	}

	result.Seen()

	step.AddScore("finish-benchmark")
	s.AddAudience(1)
}

func (s *Scenario) loadCheckClarification(ctx context.Context, step *isucandar.BenchmarkStep, team *model.Team, clars []*resources.Notification_ClarificationMessage) {
	leader := team.Leader

	bres, resources, _, err := BrowserAccess(ctx, leader, "/contestant/clarifications")
	if err != nil {
		step.AddError(err)
		return
	}

	errs := verifyResources("contestant", bres, resources)
	for _, err := range errs {
		step.AddError(err)
	}
	if len(errs) > 0 {
		return
	}

	res, err := GetClarificationsAction(ctx, leader)
	if err != nil {
		step.AddError(err)
		return
	}

	tClars := team.Clarifications()
	for _, c := range res.GetClarifications() {
		if c.GetTeamId() != team.ID {
			continue
		}

		for _, clar := range clars {
			if c.GetId() == clar.GetClarificationId() {
				for _, tc := range tClars {
					if !tc.IsAnswered() && tc.ID() == c.GetId() {
						if err := s.verifyClarification(tc, c); err != nil {
							step.AddError(err)
							continue
						}

						tc.Answered()
						step.AddScore("resolve-clarification")
					}
				}
			}
		}
	}
}
