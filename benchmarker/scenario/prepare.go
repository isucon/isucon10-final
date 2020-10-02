package scenario

import (
	"context"
	"net/url"
	"sync"
	"time"

	"github.com/isucon/isucandar"
	"github.com/isucon/isucandar/agent"
	"github.com/isucon/isucandar/failure"
	"github.com/isucon/isucandar/parallel"
	"github.com/isucon/isucandar/random/useragent"
	"github.com/isucon/isucon10-final/benchmarker/model"
	"github.com/isucon/isucon10-final/benchmarker/random"
)

func (s *Scenario) Prepare(ctx context.Context, step *isucandar.BenchmarkStep) error {
	ContestantLogger.Printf("===> PREPARE")

	s.PushService.OnInvalidPush = func(id string, err error) {
		s.handleInvalidPush(id, err, step)
	}

	a, err := s.NewAgent(agent.WithNoCache(), agent.WithNoCookie(), agent.WithTimeout(20*time.Second))
	if err != nil {
		return failure.NewError(ErrCritical, err)
	}
	a.Name = "benchmarker-initializer"

	if err := s.prepareCheck(ctx, a, step); err != nil {
		return failure.NewError(ErrCritical, err)
	}

	step.Result().Score.Reset()

	if s.NoLoad {
		return nil
	}

	s.Contest = model.NewContest(time.Now(), false)
	initResponse, initHttpResponse, err := InitializeAction(ctx, a, s.Contest)
	if err != nil {
		return failure.NewError(ErrCritical, err)
	}

	errs := verifyInitializeAction(initResponse, initHttpResponse)
	for _, err := range errs {
		step.AddError(failure.NewError(ErrCritical, err))
	}

	if len(errs) > 0 {
		return ErrScenarioCancel
	}

	s.Language = initResponse.GetLanguage()
	s.Contest.GRPCHost = initResponse.GetBenchmarkServer().GetHost()
	s.Contest.GRPCPort = initResponse.GetBenchmarkServer().GetPort()

	AdminLogger.Printf("Language: %s\n", s.Language)
	AdminLogger.Printf("HTTP: %s(tls=%v)\n", s.BaseURL, s.UseTLS)
	AdminLogger.Printf("gRPC: %s:%d\n", s.Contest.GRPCHost, s.Contest.GRPCPort)

	return nil
}

func (s *Scenario) prepareCheck(parent context.Context, a *agent.Agent, step *isucandar.BenchmarkStep) error {
	ctx, cancel := context.WithCancel(parent)
	defer cancel()

	contest := model.NewContest(time.Now(), true)
	initResponse, initHttpResponse, err := InitializeAction(ctx, a, contest)
	if err != nil {
		return err
	}

	errs := verifyInitializeAction(initResponse, initHttpResponse)
	for _, err := range errs {
		step.AddError(err)
	}

	if len(errs) > 0 {
		return ErrScenarioCancel
	}

	s.Contest = contest

	errors := step.Result().Errors
	hasErrors := func() bool {
		errors.Wait()

		return len(errors.All()) > 0
	}

	// 登録開始前にしか出来ないテスト
	s.prepareCheckBeforeSignup(contest, ctx, step)

	if hasErrors() {
		return ErrScenarioCancel
	}
	<-time.After(contest.RegistrationOpenAt.Add(500 * time.Millisecond).Sub(time.Now()))
	// 登録処理中にしか出来ないテスト
	guest := s.prepareCheckSignup(contest, ctx, step)

	if hasErrors() {
		return ErrScenarioCancel
	}

	team := contest.Teams[0]
	s.prepareCheckEqueue(team, ctx, step)

	<-time.After(contest.ContestStartsAt.Add(500 * time.Millisecond).Sub(time.Now()))
	// スコアフリーズ前にしか出来ないテスト

	s.prepareCheckDualEqueue(team, ctx, step)

	if hasErrors() {
		return ErrScenarioCancel
	}
	<-time.After(contest.ContestFreezesAt.Add(500 * time.Millisecond).Sub(time.Now()))
	// スコアフリーズ後にしか出来ないテスト

	if hasErrors() {
		return ErrScenarioCancel
	}
	<-time.After(contest.ContestEndsAt.Add(500 * time.Millisecond).Sub(time.Now()))
	// いつやってもいいテスト

	s.prepareCheckEqueue(team, ctx, step)
	s.prepareCheckLogin(guest, ctx, step)
	s.prepareCheckRequiredLogin(ctx, step)
	s.prepareCheckRequiredAdmin(team.Leader, ctx, step)
	s.prepareCheckRequiredContestant(guest, ctx, step)

	if hasErrors() {
		return ErrScenarioCancel
	}
	return nil
}

func (s *Scenario) prepareCheckBeforeSignup(c *model.Contest, ctx context.Context, step *isucandar.BenchmarkStep) {
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

	team.Leader.Agent.BaseURL = baseURL
	team.Leader.Agent.Name = useragent.Chrome()

	lead := team.Leader

	res, resources, _, err := BrowserAccess(ctx, lead, "/signup")
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

	_, chres, err := CreateTeamAction(ctx, team, lead)
	if err != nil {
		if !failure.IsCode(err, ErrX403) {
			step.AddError(err)
			return
		}
	}

	if err := verifyResponseCode(chres, []int{403}); err != nil {
		step.AddError(err)
		return
	}
}

func (s *Scenario) prepareCheckSignup(c *model.Contest, ctx context.Context, step *isucandar.BenchmarkStep) *model.Contestant {
	baseURL, err := url.Parse(s.BaseURL)
	if err != nil {
		step.AddError(err)
		return nil
	}

	team, err := model.NewTeam()
	if err != nil {
		step.AddError(err)
		return nil
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

	res, resources, _, err := BrowserAccess(ctx, lead, "/signup")
	if err != nil {
		step.AddError(err)
		return nil
	}

	errs := verifyResources("signup", res, resources)
	for _, err := range errs {
		step.AddError(err)
	}
	if len(errs) > 0 {
		return nil
	}

	sres, _, err := SignupAction(ctx, lead)
	if err != nil {
		step.AddError(err)
		return nil
	}

	if sres == nil {
		step.AddError(errorInvalidResponse("選手登録でエラーが発生しました"))
		return nil
	}

	createTeam, _, err := CreateTeamAction(ctx, team, lead)
	if err != nil {
		step.AddError(err)
		return nil
	}

	team.ID = createTeam.GetTeamId()
	c.AddTeam(team)

	registration, err := GetRegistrationSession(ctx, lead)
	if err != nil {
		step.AddError(err)
		return nil
	}

	memberInviteURL := registration.GetMemberInviteUrl()
	inviteToken := registration.GetInviteToken()

	signupMember := func(member *model.Contestant, role string) func(context.Context) {
		return func(ctx context.Context) {
			res, resources, _, err := BrowserAccess(ctx, member, "/signup")
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

			res, ires, _, err := BrowserAccess(ctx, member, memberInviteURL)
			if err != nil {
				step.AddError(err)
				return
			}

			errs = verifyResources("audience", res, ires)
			for _, err := range errs {
				step.AddError(err)
			}
			if len(errs) > 0 {
				return
			}

			_, err = JoinTeamAction(ctx, team, member, inviteToken)
			switch role {
			case "invalid":
				if err == nil {
					step.AddError(errorInvalidResponse("チームあたりの上限参加人数を超えて登録が成功しました"))
					return
				}

				var xerr *ProtobufError
				if failure.As(err, &xerr) {
					if !AssertEqual("Team over join code", ErrX400.ErrorCode(), xerr.ErrorCode()) || !AssertEqual("Team over join message", "XSUPORTAL[400]: チーム人数の上限に達しています(POST /api/registration/contestant)", xerr.Error()) {
						step.AddError(errorInvalidResponse("チームあたりの上限参加人数を超えての登録に期待するエラーを返していません"))
						return
					}
				} else {
					step.AddError(err)
				}
				return
			case "invalid-token":
				if err == nil {
					step.AddError(errorInvalidResponse("不正な招待コードでの登録を許しています"))
					return
				}

				var xerr *ProtobufError
				if failure.As(err, &xerr) {
					if !AssertEqual("Team invalid token code", ErrX400.ErrorCode(), xerr.ErrorCode()) || !AssertEqual("Team invalid token message", "XSUPORTAL[400]: 招待URLが不正です(POST /api/registration/contestant)", xerr.Error()) {
						step.AddError(errorInvalidResponse("不正な招待コードでの登録に期待するエラーを返していません"))
						return
					}
				} else {
					step.AddError(err)
				}
				return
			default:
				if err != nil {
					step.AddError(err)
					return
				}
			}

			switch role {
			case "dev":
				team.Developer = member
			case "ops":
				team.Operator = member
			}
		}
	}

	para := parallel.NewParallel(ctx, 2)

	para.Do(signupMember(dev, "dev"))
	para.Do(signupMember(ops, "ops"))

	para.Wait()

	// チーム上限に達しているのに入ろうとする人
	invalider, err := model.NewContestant()
	if err != nil {
		step.AddError(err)
		return nil
	}

	invalider.Agent.BaseURL = baseURL
	invalider.Agent.Name = useragent.Chrome()

	signupMember(invalider, "invalid")(ctx)

	memberInviteURL = memberInviteURL + "-invalid"
	inviteToken = inviteToken + "-invalid"

	id := invalider.ID
	invalider.ID = random.Alphabet(model.CONTESTANT_ID_LENGTH)
	signupMember(invalider, "invalid-token")(ctx)

	invalider.ID = id

	// 重複登録を試す
	sres, hsres, err := SignupAction(ctx, lead)
	if err != nil {
		if !failure.IsCode(err, ErrX400) {
			step.AddError(err)
			return nil
		}
	}

	if err := verifyResponseCode(hsres, []int{400}); err != nil {
		step.AddError(err)
		return nil
	}

	return invalider
}

func (s *Scenario) prepareCheckLogin(guest *model.Contestant, ctx context.Context, step *isucandar.BenchmarkStep) {
	_, err := LoginAction(ctx, guest)
	if err != nil {
		step.AddError(err)
		return
	}

	validPassword := guest.Password
	guest.Password = guest.Password + "-invalid"
	_, err = LoginAction(ctx, guest)
	if err == nil {
		step.AddError(errorInvalidResponse("間違ったパスワードでのログインが許されています"))
		return
	}

	var xerr *ProtobufError
	if failure.As(err, &xerr) {
		if !AssertEqual("Login password code", ErrX400, xerr.ErrorCode()) || !AssertEqual("Login password message", "XSUPORTAL[400]: ログインIDまたはパスワードが正しくありません(POST /api/login)", xerr.Error()) {
			step.AddError(errorInvalidResponse("間違ったパスワードでのログインに期待するエラーを返していません"))
			return
		}
	} else {
		step.AddError(errorInvalidResponse("間違ったパスワードでのログインが許されています"))
		return
	}

	guest.Password = validPassword
	guest.ID = random.Alphabet(model.CONTESTANT_ID_LENGTH) + "invalid"
	_, err = LoginAction(ctx, guest)
	if err == nil {
		step.AddError(errorInvalidResponse("間違った ID でのログインが許されています"))
		return
	}

	if failure.As(err, &xerr) {
		if !AssertEqual("Login id code", ErrX400, xerr.ErrorCode()) || !AssertEqual("Login id message", "XSUPORTAL[400]: ログインIDまたはパスワードが正しくありません(POST /api/login)", xerr.Error()) {
			step.AddError(errorInvalidResponse("間違った ID でのログインに期待するエラーを返していません"))
			return
		}
	} else {
		step.AddError(errorInvalidResponse("間違った ID でのログインが許されています"))
		return
	}
}

func (s *Scenario) prepareCheckRequiredLogin(ctx context.Context, step *isucandar.BenchmarkStep) {
	guest, err := model.NewContestant()
	if err != nil {
		panic(err)
	}
	baseURL, err := url.Parse(s.BaseURL)
	if err != nil {
		panic(err)
	}

	guest.Agent.BaseURL = baseURL
	guest.Agent.Name = useragent.Chrome()

	checker := func(phase string, err error) {
		e := errorInvalidResponse("ログインを要するエンドポイントにログインせずにアクセス可能になっています: %s", phase)
		var xerr *ProtobufError
		if err == nil {
			step.AddError(e)
			return
		}

		if failure.As(err, &xerr) {
			if !AssertEqual("Required contestant", ErrX401.ErrorCode(), xerr.ErrorCode()) || !AssertEqual("Required contestant", "XSUPORTAL[401]: ログインが必要です("+phase+")", xerr.Error()) {
				step.AddError(e)
				return
			}
		} else {
			step.AddError(e)
			return
		}
	}

	t, err := model.NewTeam()
	if err != nil {
		panic(err)
	}

	t.Leader = guest
	t.Operator = guest
	t.Developer = guest

	wg := sync.WaitGroup{}

	wg.Add(1)
	go func() {
		defer wg.Done()
		_, err := AdminGetClarificationsAction(ctx, guest)
		checker("GET /api/admin/clarifications", err)
	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		_, err := AdminGetClarificationAction(ctx, 1, guest)
		checker("GET /api/admin/clarifications/1", err)
	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		clar := model.NewClarification(t)
		clar.SetID(1)
		_, err := AdminPostClarificationAction(ctx, guest, clar)
		checker("PUT /api/admin/clarifications/1", err)
	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		_, err := EnqueueBenchmarkJobAction(ctx, t)
		checker("POST /api/contestant/benchmark_jobs", err)
	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		_, err := GetBenchmarkJobs(ctx, t, guest)
		checker("GET /api/contestant/benchmark_jobs", err)
	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		_, err := GetBenchmarkJobAction(ctx, 1, guest)
		checker("GET /api/contestant/benchmark_jobs/1", err)
	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		_, err := GetClarificationsAction(ctx, guest)
		checker("GET /api/contestant/clarifications", err)
	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		clar := model.NewClarification(t)
		_, err := PostClarificationAction(ctx, guest, clar)
		checker("POST /api/contestant/clarifications", err)
	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		_, _, err := GetDashboardAction(ctx, t, guest, 2*time.Second)
		checker("GET /api/contestant/dashboard", err)
	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		_, err := GetNotifications(ctx, guest)
		checker("GET /api/contestant/notifications", err)
	}()

	wg.Wait()
}

func (s *Scenario) prepareCheckRequiredContestant(guest *model.Contestant, ctx context.Context, step *isucandar.BenchmarkStep) {
	checker := func(phase string, err error) {
		e := errorInvalidResponse("チームに所属する選手以外がアクセスできないエンドポイントにアクセス可能になっています: %s", phase)
		var xerr *ProtobufError
		if err == nil {
			step.AddError(e)
			return
		}

		if failure.As(err, &xerr) {
			if !AssertEqual("Required contestant", ErrX403.ErrorCode(), xerr.ErrorCode()) || !AssertEqual("Required contestant", "XSUPORTAL[403]: 参加登録が必要です("+phase+")", xerr.Error()) {
				step.AddError(e)
				return
			}
		} else {
			step.AddError(e)
			return
		}
	}

	t, err := model.NewTeam()
	if err != nil {
		panic(err)
	}

	t.Leader = guest
	t.Operator = guest
	t.Developer = guest

	wg := sync.WaitGroup{}

	wg.Add(1)
	go func() {
		defer wg.Done()
		_, err := EnqueueBenchmarkJobAction(ctx, t)
		checker("POST /api/contestant/benchmark_jobs", err)
	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		_, err := GetBenchmarkJobs(ctx, t, guest)
		checker("GET /api/contestant/benchmark_jobs", err)
	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		_, err := GetBenchmarkJobAction(ctx, 1, guest)
		checker("GET /api/contestant/benchmark_jobs/1", err)
	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		_, err := GetClarificationsAction(ctx, guest)
		checker("GET /api/contestant/clarifications", err)
	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		clar := model.NewClarification(t)
		_, err := PostClarificationAction(ctx, guest, clar)
		checker("POST /api/contestant/clarifications", err)
	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		_, _, err := GetDashboardAction(ctx, t, guest, 2*time.Second)
		checker("GET /api/contestant/dashboard", err)
	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		_, err := GetNotifications(ctx, guest)
		checker("GET /api/contestant/notifications", err)
	}()

	wg.Wait()
}

func (s *Scenario) prepareCheckDualEqueue(t *model.Team, ctx context.Context, step *isucandar.BenchmarkStep) {
	checker := func(phase string, err error) {
		e := errorInvalidResponse("多重なベンチマークのエンキューに成功しました: %s", phase)
		var xerr *ProtobufError
		if err == nil {
			step.AddError(e)
			return
		}

		if failure.As(err, &xerr) {
			if !AssertEqual("Enqueue", ErrX403.ErrorCode(), xerr.ErrorCode()) || !AssertEqual("Enqueue", "XSUPORTAL[403]: 既にベンチマークを実行中です(POST /api/contestant/benchmark_jobs)", xerr.Error()) {
				step.AddError(e)
				return
			}
		} else {
			step.AddError(e)
			return
		}
	}

	_, err := EnqueueBenchmarkJobAction(ctx, t)
	if err != nil {
		step.AddError(err)
		return
	}

	_, err = EnqueueBenchmarkJobAction(ctx, t)
	checker("POST /api/contestant/benchmark_jobs", err)
}

func (s *Scenario) prepareCheckEqueue(t *model.Team, ctx context.Context, step *isucandar.BenchmarkStep) {
	checker := func(phase string, err error) {
		e := errorInvalidResponse("競技時間外にベンチマークのエンキューに成功しました: %s", phase)
		var xerr *ProtobufError
		if err == nil {
			step.AddError(e)
			return
		}

		if failure.As(err, &xerr) {
			if !AssertEqual("Enqueue", ErrX403.ErrorCode(), xerr.ErrorCode()) || !AssertEqual("Enqueue", "XSUPORTAL[403]: 競技時間外はベンチマークを実行できません(POST /api/contestant/benchmark_jobs)", xerr.Error()) {
				step.AddError(e)
				return
			}
		} else {
			step.AddError(e)
			return
		}
	}

	_, err := EnqueueBenchmarkJobAction(ctx, t)
	checker("POST /api/contestant/benchmark_jobs", err)
}

func (s *Scenario) prepareCheckRequiredAdmin(guest *model.Contestant, ctx context.Context, step *isucandar.BenchmarkStep) {
	checker := func(phase string, err error) {
		e := errorInvalidResponse("管理権限が必要なエンドポイントにアクセス可能になっています: %s", phase)
		var xerr *ProtobufError
		if err == nil {
			step.AddError(e)
			return
		}

		if failure.As(err, &xerr) {
			if !AssertEqual("Required contestant", ErrX403.ErrorCode(), xerr.ErrorCode()) || !AssertEqual("Required contestant", "XSUPORTAL[403]: 管理者権限が必要です("+phase+")", xerr.Error()) {
				step.AddError(e)
				return
			}
		} else {
			step.AddError(e)
			return
		}
	}

	t, err := model.NewTeam()
	if err != nil {
		panic(err)
	}

	t.Leader = guest
	t.Operator = guest
	t.Developer = guest

	wg := sync.WaitGroup{}

	wg.Add(1)
	go func() {
		defer wg.Done()
		_, err := AdminGetClarificationsAction(ctx, guest)
		checker("GET /api/admin/clarifications", err)
	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		_, err := AdminGetClarificationAction(ctx, 1, guest)
		checker("GET /api/admin/clarifications/1", err)
	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		clar := model.NewClarification(t)
		clar.SetID(1)
		_, err := AdminPostClarificationAction(ctx, guest, clar)
		checker("PUT /api/admin/clarifications/1", err)
	}()

	wg.Wait()
}
