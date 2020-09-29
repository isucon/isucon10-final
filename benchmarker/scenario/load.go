package scenario

import (
	"context"
	"encoding/base64"
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

func (s *Scenario) Load(ctx context.Context, step *isucandar.BenchmarkStep) error {
	ContestantLogger.Printf("===> LOAD")
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

	<-time.After(s.Contest.ContestEndsAt.Add(1 * time.Second).Sub(time.Now()))

	return nil
}

// 競技者用ベンチマーカーの起動。1チームにつき1ベンチマーカー起動する。
func (s *Scenario) loadBenchmarker(ctx context.Context, step *isucandar.BenchmarkStep) {
	ctx, cancel := context.WithDeadline(ctx, s.Contest.ContestEndsAt.Add(-1*time.Second))
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

		// TODO: 本来であれば dashboard に到達してから subscribe ボタンを押下して実施される流れなので、dashboard の時にとった session を利用したい ~sorah
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

				_, _, _, err = BrowserAccess(ctx, member, memberInviteURL)
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

				// TODO: 本来であれば dashboard に到達してから subscribe ボタンを押下して実施される流れなので、dashboard の時にとった session を利用したい ~sorah
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
	// TODO: 並列数は要検討
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

// 競技者によるベンチマークの開始。
func (s *Scenario) loadEnqueueBenchmark(ctx context.Context, step *isucandar.BenchmarkStep) error {
	ctx, cancel := context.WithDeadline(ctx, s.Contest.ContestEndsAt)
	defer cancel()

	w, err := worker.NewWorker(func(ctx context.Context, index int) {
		team := s.Contest.Teams[index]

		for {
			select {
			case <-ctx.Done():
				return
			case team.EnqueueLock <- struct{}{}:
			}

			// すべての Clar の解決を待つ
			<-team.WaitAllClarResolve(ctx)

			// ダッシュボード開いてキューを積むのでブラウザアクセスとダッシュボード的 API 呼び出しを含む
			res, resources, _, err := BrowserAccess(ctx, team.Developer, "/contestant")
			if err != nil {
				go func() { <-team.EnqueueLock }()
				step.AddError(err)
				continue
			}

			errs := verifyResources("contestant", res, resources)
			for _, err := range errs {
				step.AddError(err)
			}
			if len(errs) > 0 {
				go func() { <-team.EnqueueLock }()
				continue
			}

			go GetDashboardAction(ctx, team, team.Developer)
			go GetBenchmarkJobs(ctx, team, team.Developer)

			job, err := EnqueueBenchmarkJobAction(ctx, team)
			if err != nil {
				if failure.IsCode(err, ErrScenarioCancel) {
					return
				}
				step.AddError(err)
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

		res, resources, _, err := BrowserAccess(ctx, team.Operator, "/contestant")
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

		for ctx.Err() == nil {
			timer := time.After(1 * time.Second)
			wg := sync.WaitGroup{}
			wg.Add(2)

			failed := uint32(0)
			go func() {
				defer wg.Done()

				requestedAt := time.Now().UTC()
				latestMarkedAt := s.LatestMarkedAt()
				hres, res, err := GetDashboardAction(ctx, team, team.Operator)
				if err != nil {
					step.AddError(err)
					atomic.StoreUint32(&failed, 1)
					return
				}

				if err := verifyLeaderboard(requestedAt, res.GetLeaderboard(), hres, s.Contest, team, latestMarkedAt, false); err != nil {
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
	ctx, cancel := context.WithDeadline(ctx, s.Contest.ContestEndsAt.Add(-1*time.Second))
	defer cancel()

	w, err := worker.NewWorker(func(ctx context.Context, index int) {
		team := s.Contest.Teams[index]
		leader := team.Leader

		latestClarPostedAt := time.Now()

		for ctx.Err() == nil {
			if time.Now().After(latestClarPostedAt.Add(3 * time.Second)) {
				page, resources, _, err := BrowserAccess(ctx, leader, "/contestant/clarifications")
				if err != nil {
					step.AddError(err)
					continue
				}

				errs := verifyResources("contestant", page, resources)
				for _, err := range errs {
					step.AddError(err)
				}
				if len(errs) > 0 {
					continue
				}

				_, err = GetClarificationsAction(ctx, leader)
				if err != nil {
					step.AddError(err)
					continue
				}
				step.AddScore("get-clarification")

				clar := model.NewClarification(team)
				team.AddClar(clar)

				res, err := PostClarificationAction(ctx, leader, clar)
				if err != nil {
					step.AddError(err)
					continue
				}

				clar.SetID(res.GetClarification().GetId())
				s.Contest.AddClar(clar)
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

// 管理者による Clar のチェックと解答。Clar には自動更新がないのでブラウザリロードを毎回行っている。
func (s *Scenario) loadAdminClarification(ctx context.Context, step *isucandar.BenchmarkStep) error {
	ctx, cancel := context.WithDeadline(ctx, s.Contest.ContestEndsAt)
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

			cres, cresources, _, err := BrowserAccess(ctx, admin, "/admin/clarifications")
			if err != nil {
				step.AddError(err)
				continue
			}

			errs := verifyResources("admin", cres, cresources)
			for _, err := range errs {
				step.AddError(err)
			}
			if len(errs) > 0 {
				return
			}

			res, err := AdminGetClarificationsAction(ctx, admin)
			if err != nil {
				step.AddError(err)
				continue
			}
			step.AddScore("admin-get-clarifications")

			wg := sync.WaitGroup{}
			for _, clar := range res.GetClarifications() {
				var cClar *model.Clarification = nil
				team := s.Contest.GetTeam(clar.GetTeamId())
				for _, tClar := range team.Clarifications() {
					if tClar.ID() == clar.GetId() {
						cClar = tClar
						break
					}
				}

				if cClar == nil {
					step.AddError(errorInvalidResponse("存在しないはずの Clarification です"))
					continue
				}

				// TODO: 検証をしていない
				if clar.GetAnswered() {
					continue
				}

				wg.Add(1)
				go func(clar *model.Clarification) {
					defer wg.Done()

					gRes, err := AdminGetClarificationAction(ctx, clar.ID(), admin)
					if err != nil {
						step.AddError(err)
						return
					}
					resClar := gRes.GetClarification()

					if resClar.GetTeamId() != clar.TeamID {
						step.AddError(errorInvalidResponse("Clarification のチーム ID が一致しません"))
						return
					}

					if resClar.GetQuestion() != clar.Question {
						step.AddError(errorInvalidResponse("Clarification の質問文が一致しません"))
						return
					}

					step.AddScore("admin-get-clarification")

					_, err = AdminPostClarificationAction(ctx, admin, clar)
					if err != nil {
						step.AddError(err)
						return
					}
					step.AddScore("admin-answer-clarification")
				}(cClar)
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
	ctx, cancel := context.WithDeadline(ctx, s.Contest.ContestEndsAt.Add(-5*time.Second))
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
			timer := time.After(1 * time.Second)

			requestedAt := time.Now().UTC()
			latestMarkedAt := s.LatestMarkedAt()
			hres, res, err := AudienceGetDashboardAction(ctx, viewer)
			if err != nil {
				// オーディエンスはエラーを記録しない
				step.AddError(err)
				return
			}

			if err := verifyLeaderboard(requestedAt, res.GetLeaderboard(), hres, s.Contest, nil, latestMarkedAt, true); err != nil {
				// オーディエンスによる計測失敗は考慮しない
				step.AddError(err)
				return
			}

			step.AddScore("audience-get-dashboard")

			select {
			case <-timer:
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
	ctx, cancel := context.WithDeadline(parent, s.Contest.ContestEndsAt)
	defer cancel()

	notificationChan := make(chan []*resources.Notification, 32)

	go s.subscribeToPushNotification(parent, step, member, session, notificationChan)
	go s.loadListNotifications(parent, step, member, notificationChan)

	idBucket, err := simplelru.NewLRU(256, func(k interface{}, v interface{}) {})
	if err != nil {
		panic(err) // NewLRU errors when passed capacity is negative
	}

	for {
		select {
		case <-ctx.Done():
			return
		case notifications := <-notificationChan:
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

func (s *Scenario) loadListNotifications(parent context.Context, step *isucandar.BenchmarkStep, member *model.Contestant, channel chan<- []*resources.Notification) {
	ctx, cancel := context.WithDeadline(parent, s.Contest.ContestEndsAt)
	defer cancel()

	for {
		notifications, err := GetNotifications(ctx, member)
		if err == nil {
			// TODO: last_answered_clarification_id の検証をやっていない
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

var ErrBenchamrkJobDetail failure.StringCode = "benchmark-job-details"

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

	err = verifyGetBenchmarkJobDetail(res, team, result)
	if err != nil {
		step.AddError(failure.NewError(ErrBenchamrkJobDetail, err))
		return
	}

	defer func() { <-team.EnqueueLock }()

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
					if tc.ID() == c.GetId() {
						tc.Answered()
						step.AddScore("resolve-clarification")
					}
				}
			}
		}
	}
}
