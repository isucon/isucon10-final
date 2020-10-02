package scenario

import (
	"context"
	"math/rand"
	"net/url"
	"sort"
	"time"

	"github.com/isucon/isucandar"
	"github.com/isucon/isucandar/failure"
	"github.com/isucon/isucandar/random/useragent"
	"github.com/isucon/isucandar/worker"
	"github.com/isucon/isucon10-final/benchmarker/model"
	"github.com/isucon/isucon10-final/benchmarker/proto/xsuportal/resources"
)

type validateLeaderbord struct {
}

func (s *Scenario) Validation(ctx context.Context, step *isucandar.BenchmarkStep) error {
	if s.NoLoad {
		return nil
	}

	ContestantLogger.Printf("===> VALIDATION")
	<-time.After(s.Contest.ContestEndsAt.Add(5 * time.Second).Sub(time.Now()))

	s.validationLeaderboard(ctx, step)
	s.validationClarificationRead(ctx, step)
	s.validationClarification(ctx, step)
	return nil
}

func (s *Scenario) validationLeaderboard(ctx context.Context, step *isucandar.BenchmarkStep) {
	at := s.Contest.ContestEndsAt.Add(10 * time.Second)
	teams := s.Contest.Teams
	generalTeams := []*model.Team{}
	studentTeams := []*model.Team{}

	sort.Slice(teams, func(i int, j int) bool {
		ils, ilt := teams[i].LatestScore(at)
		jls, jlt := teams[j].LatestScore(at)
		if ils == jls {
			return jlt.After(ilt)
		}
		return ils > jls
	})

	// ContestantLogger.Println("=> Expected ranking")
	tidMap := make(map[int64]*model.Team)
	for _, team := range teams {
		// ContestantLogger.Printf("%d: %s\n", i+1, team.TeamName)
		tidMap[team.ID] = team

		if team.IsStudent {
			studentTeams = append(studentTeams, team)
		} else {
			generalTeams = append(generalTeams, team)
		}
	}

	w, err := worker.NewWorker(func(ctx context.Context, idx int) {
		// 1〜5秒ランダムに待つ
		<-time.After(time.Duration(rand.Int63n(5)+1) * time.Second)

		var leaderboard *resources.Leaderboard

		if idx < len(teams) {
			t := teams[idx]
			_, res, err := GetDashboardAction(ctx, t, t.Leader, 10*time.Second)
			if err != nil {
				step.AddError(failure.NewError(ErrCritical, err))
				return
			}
			leaderboard = res.GetLeaderboard()
		} else {
			admin, err := model.NewAdmin()
			if err != nil {
				step.AddError(failure.NewError(ErrCritical, err))
				return
			}
			admin.Agent.BaseURL, _ = url.Parse(s.BaseURL)
			admin.Agent.Name = useragent.Chrome()

			_, err = LoginAction(ctx, admin)
			if err != nil {
				step.AddError(failure.NewError(ErrCritical, err))
				return
			}

			_, res, err := AudienceGetDashboardAction(ctx, admin.Agent, 10*time.Second)
			if err != nil {
				step.AddError(failure.NewError(ErrCritical, err))
				return
			}
			leaderboard = res.GetLeaderboard()
		}

		s.validationLeaderboardWithTeams(step, teams, leaderboard.GetTeams())
		s.validationLeaderboardWithTeams(step, generalTeams, leaderboard.GetGeneralTeams())
		s.validationLeaderboardWithTeams(step, studentTeams, leaderboard.GetStudentTeams())

	}, worker.WithLoopCount(int32(len(teams)+1)))
	if err != nil {
		step.AddError(failure.NewError(ErrCritical, err))
		return
	}

	w.Process(ctx)
}

func (s *Scenario) validationLeaderboardWithTeams(step *isucandar.BenchmarkStep, teams []*model.Team, aTeams []*resources.Leaderboard_LeaderboardItem) {
	at := s.Contest.ContestEndsAt.Add(10 * time.Second)

	errTeamId := failure.NewError(ErrCritical, errorInvalidResponse("リーダーボード上の最終 ID 検証に失敗しました"))
	errStudent := failure.NewError(ErrCritical, errorInvalidResponse("リーダーボード上の最終学生チーム検証に失敗しました"))
	errBestScore := failure.NewError(ErrCritical, errorInvalidResponse("リーダーボード上の最終ベストスコア検証に失敗しました"))
	errLatestScore := failure.NewError(ErrCritical, errorInvalidResponse("リーダーボード上の最終最新スコア検証に失敗しました"))
	errScoreCount := failure.NewError(ErrCritical, errorInvalidResponse("最終検証でのスコアデータ数検証に失敗しました"))
	errScore := failure.NewError(ErrCritical, errorInvalidResponse("最終検証でのスコアデータのスコア検証に失敗しました"))
	errScoreMark := failure.NewError(ErrCritical, errorInvalidResponse("最終検証でのスコアデータの時刻検証に失敗しました"))

	for idx, ateamResult := range aTeams {
		eteam := teams[idx]

		ateam := ateamResult.GetTeam()
		if !AssertEqual("Validate leaderboard team id", eteam.ID, ateam.GetId()) {
			step.AddError(errTeamId)
			return
		}

		if !AssertEqual("Validate leaderboard student", eteam.IsStudent, ateam.GetStudent().GetStatus()) {
			step.AddError(errStudent)
			return
		}

		eb, _ := eteam.BestScore(at)
		if !AssertEqual("Validate leaderboard best", eb, ateamResult.GetBestScore().GetScore()) {
			step.AddError(errBestScore)
			return
		}

		el, _ := eteam.LatestScore(at)
		if !AssertEqual("Validate leaderboard latest", el, ateamResult.GetLatestScore().GetScore()) {
			step.AddError(errLatestScore)
			return
		}

		escores := eteam.BenchmarkResults(at)
		if !AssertEqual("Validate leaderboard score count", int64(len(escores)), ateamResult.GetFinishCount()) {
			step.AddError(errScoreCount)
			return
		}

		for idx, ascore := range ateamResult.GetScores() {
			escore := escores[idx]

			if !AssertEqual("validate score", escore.Score, ascore.GetScore()) {
				step.AddError(errScore)
				return
			}

			if !AssertEqual("validate marked at", escore.MarkedAt(), ascore.GetMarkedAt().AsTime()) {
				step.AddError(errScoreMark)
				return
			}
		}
	}
}

func (s *Scenario) validationClarification(ctx context.Context, step *isucandar.BenchmarkStep) {
	errNotFound := failure.NewError(ErrCritical, errorInvalidResponse("最終検証にて存在しないはずの Clarification が見つかりました"))
	errNotMatch := failure.NewError(ErrCritical, errorInvalidResponse("最終検証にて Clarification の検証に失敗しました"))

	admin, err := model.NewAdmin()
	if err != nil {
		step.AddError(failure.NewError(ErrCritical, err))
		return
	}
	admin.Agent.BaseURL, _ = url.Parse(s.BaseURL)
	admin.Agent.Name = useragent.Chrome()

	_, err = LoginAction(ctx, admin)
	if err != nil {
		step.AddError(failure.NewError(ErrCritical, err))
		return
	}

	res, err := AdminGetClarificationsAction(ctx, admin)
	if err != nil {
		step.AddError(failure.NewError(ErrCritical, err))
		return
	}

	eclarID := make(map[int64]*model.Clarification)
	for _, eclar := range s.Contest.Clarifications() {
		eclarID[eclar.ID()] = eclar
	}

	for _, aclar := range res.GetClarifications() {
		// 終了10秒前以降の Clar は検証しない
		if aclar.GetCreatedAt().AsTime().After(s.Contest.ContestEndsAt.Add(-10 * time.Second)) {
			continue
		}

		eclar, ok := eclarID[aclar.GetId()]
		if !ok {
			step.AddError(errNotFound)
			return
		}

		// 終了10秒前以降に操作した Clar は検証しない
		if eclar.SentAt().After(s.Contest.ContestEndsAt.Add(-10 * time.Second)) {
			continue
		}

		if !AssertEqual("validate clar team id", eclar.TeamID, aclar.GetTeamId()) ||
			!AssertEqual("validate clar question", eclar.Question, aclar.GetQuestion()) ||
			!AssertEqual("validate clar answer", eclar.Answer, aclar.GetAnswer()) ||
			!AssertEqual("validate clar disclose", eclar.Disclose, aclar.GetDisclosed()) {
			step.AddError(errNotMatch)
			return
		}
	}
}

func (s *Scenario) validationClarificationRead(ctx context.Context, step *isucandar.BenchmarkStep) {
	errNotFound := failure.NewError(ErrCritical, errorInvalidResponse("あるべき通知を受信していないことが検知されました"))

	expectedClarIDs := []int64{}
	for _, clar := range s.Contest.Clarifications() {
		if !clar.Disclose || !clar.IsAnswered() || clar.SentAt().After(s.Contest.ContestEndsAt.Add(-10*time.Second)) {
			continue
		}
		expectedClarIDs = append(expectedClarIDs, clar.ID())
	}

	for _, team := range s.Contest.Teams {
		teamReceivedClarIDs := []int64{}
		teamReceivedClarIDs = append(teamReceivedClarIDs, team.Leader.ReceivedClarIDs()...)
		teamReceivedClarIDs = append(teamReceivedClarIDs, team.Developer.ReceivedClarIDs()...)
		teamReceivedClarIDs = append(teamReceivedClarIDs, team.Operator.ReceivedClarIDs()...)

		for _, expectedID := range expectedClarIDs {
			if !includeID(teamReceivedClarIDs, expectedID) {
				AdminLogger.Printf("Clar notification not found: expected: %d / received: %v\n", expectedID, teamReceivedClarIDs)
				step.AddError(errNotFound)
				return
			}
		}
	}
}

func includeID(list []int64, id int64) bool {
	for _, a := range list {
		if a == id {
			return true
		}
	}
	return false
}
