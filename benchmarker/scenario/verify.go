package scenario

import (
	"crypto/sha512"
	"fmt"
	"io/ioutil"
	"math"
	"net"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/isucon/isucandar"
	"github.com/isucon/isucandar/agent"
	"github.com/isucon/isucandar/failure"
	"github.com/isucon/isucon10-final/benchmarker/model"
	"github.com/isucon/isucon10-final/benchmarker/proto/xsuportal/resources"
	"github.com/isucon/isucon10-final/benchmarker/proto/xsuportal/services/admin"
	"github.com/isucon/isucon10-final/benchmarker/proto/xsuportal/services/contestant"
)

var (
	ErrCritical        failure.StringCode = "critical"
	ErrInvalidResponse failure.StringCode = "invalid-response"
	ErrChecksum        failure.StringCode = "checksum"
	ErrWebPush         failure.StringCode = "webpush"
	ErrHTTP            failure.StringCode = "http"

	checksums = map[string]string{}
)

func init() {
	exe, _ := os.Executable()
	checksumDir := filepath.Join(filepath.Dir(exe), "../checksum")

	var walk func(string)
	walk = func(dir string) {
		entries, err := ioutil.ReadDir(dir)
		if err != nil {
			panic(err)
		}

		for _, entry := range entries {
			path := filepath.Join(dir, entry.Name())
			if entry.IsDir() {
				walk(path)
			} else {
				bytes, err := ioutil.ReadFile(path)
				if err != nil {
					panic(err)
				}
				checksums[strings.TrimPrefix(path, checksumDir)] = strings.TrimSpace(string(bytes))
			}
		}
	}
	walk(checksumDir)
}

func errorInvalidStatusCode(res *http.Response) error {
	return failure.NewError(ErrX5XX, fmt.Errorf("不正な HTTP ステータスコード: %d (%s: %s)", res.StatusCode, res.Request.Method, res.Request.URL.Path))
}

func errorInvalidResponse(message string, args ...interface{}) error {
	return failure.NewError(ErrInvalidResponse, fmt.Errorf(message, args...))
}

func errorChecksum(base string, resource *agent.Resource, name string) error {
	if resource == nil {
		AdminLogger.Printf("resource not found: %s on %s\n", name, base)
		return failure.NewError(ErrChecksum, errorInvalidResponse("チェックサムの取得に失敗しました: %s", name))
	}

	if resource.Error != nil {
		var nerr net.Error
		if failure.As(resource.Error, &nerr) {
			if nerr.Timeout() || nerr.Temporary() {
				return nerr
			}
		}
		return failure.NewError(ErrChecksum, errorInvalidResponse("リソースの取得に失敗しました: %v", resource.Error))
	}

	res := resource.Response
	defer res.Body.Close()

	if res.StatusCode == 304 {
		return nil
	}

	if res.StatusCode != 200 {
		return errorInvalidStatusCode(res)
	}

	path := res.Request.URL.Path
	bytes, err := ioutil.ReadAll(res.Body)
	if err != nil {
		AdminLogger.Printf("resource checksum: %v", err)
		return failure.NewError(ErrChecksum, errorInvalidResponse("チェックサムの取得に失敗しました: %s", path))
	}
	resChecksum := fmt.Sprintf("%x", sha512.Sum384(bytes))
	if !AssertEqual("Validate checksum", checksums[path], resChecksum) {
		return failure.NewError(ErrChecksum, errorInvalidResponse("チェックサムの比較に失敗しました: %s", path))
	}
	return nil
}

func verifyInitializeAction(res *admin.InitializeResponse, hres *http.Response) []error {
	errors := []error{}
	if hres.StatusCode != 200 {
		errors = append(errors, errorInvalidStatusCode(hres))
	}

	if len(res.GetLanguage()) == 0 {
		errors = append(errors, errorInvalidResponse("利用言語が設定されていません"))
	}

	return errors
}

func verifyResponseCode(res *http.Response, allowedStatusCodes []int) error {
	for _, statusCode := range allowedStatusCodes {
		if res.StatusCode == statusCode {
			return nil
		}
	}
	return errorInvalidStatusCode(res)
}

func joinURL(base *url.URL, target string) string {
	b := *base
	t, _ := url.Parse(target)
	u := b.ResolveReference(t).String()
	return u
}

func verifyResources(page string, res *http.Response, resources agent.Resources) []error {
	if res.StatusCode != 200 && res.StatusCode != 304 {
		return []error{errorInvalidStatusCode(res)}
	}

	if resources == nil {
		// Skip check on empty resources
		return []error{}
	}

	base := res.Request.URL.String()

	var checks []error
	switch page {
	case "signup":
		checks = []error{
			errorChecksum(base, resources[joinURL(res.Request.URL, "/packs/audience.js")], "/packs/audience.js"),
			errorChecksum(base, resources[joinURL(res.Request.URL, "/packs/vendor.js")], "/packs/vendor.js"),
			errorChecksum(base, resources[joinURL(res.Request.URL, "/packs/vendor.css")], "/packs/vendor.css"),
		}
	case "audience":
		checks = []error{
			errorChecksum(base, resources[joinURL(res.Request.URL, "/packs/audience.js")], "/packs/audience.js"),
			errorChecksum(base, resources[joinURL(res.Request.URL, "/packs/vendor.js")], "/packs/vendor.js"),
			errorChecksum(base, resources[joinURL(res.Request.URL, "/packs/vendor.css")], "/packs/vendor.css"),
		}
	case "contestant":
		checks = []error{
			errorChecksum(base, resources[joinURL(res.Request.URL, "/packs/contestant.js")], "/packs/contestant.js"),
			errorChecksum(base, resources[joinURL(res.Request.URL, "/packs/vendor.js")], "/packs/vendor.js"),
			errorChecksum(base, resources[joinURL(res.Request.URL, "/packs/vendor.css")], "/packs/vendor.css"),
		}
	case "admin":
		checks = []error{
			errorChecksum(base, resources[joinURL(res.Request.URL, "/packs/admin.js")], "/packs/admin.js"),
			errorChecksum(base, resources[joinURL(res.Request.URL, "/packs/vendor.js")], "/packs/vendor.js"),
			errorChecksum(base, resources[joinURL(res.Request.URL, "/packs/vendor.css")], "/packs/vendor.css"),
		}
	}
	errs := []error{}
	for _, err := range checks {
		if err != nil {
			errs = append(errs, err)
		}
	}

	return errs
}

func verifyLeaderboard(requestedAt time.Time, leaderboard *resources.Leaderboard, hres *http.Response, contest *model.Contest, vTeam *model.Team, sLatestMarkedAt time.Time, allowCache bool) error {
	at := requestedAt.UTC()

	prevLatestScore := int64(math.MaxInt64)
	prevLatestMarkedAt := time.Now().UTC().Add(1 * time.Hour)
	zero := time.Unix(0, 0)
	maxMarkedAt := zero
	for _, item := range leaderboard.GetTeams() {
		team := item.GetTeam()
		cTeam := contest.GetTeam(team.GetId())
		if cTeam == nil {
			return failure.NewError(ErrCritical, errorInvalidResponse("登録されていないチームがリーダーボード上に存在します: ID %d", team.GetId()))
		}

		if !AssertEqual("Leaderboard student team flag", cTeam.IsStudent, team.GetStudent().GetStatus()) {
			return errorInvalidResponse("学生チームかどうかの判定が不正です")
		}

		targetAt := at
		if !(vTeam != nil && vTeam.ID == cTeam.ID) && (at.After(contest.ContestFreezesAt) || at.Equal(contest.ContestFreezesAt)) {
			targetAt = contest.ContestFreezesAt.UTC()
		}

		results := cTeam.BenchmarkResults(targetAt)

		if len(results) < len(item.GetScores()) {
			now := time.Now().UTC()
			results = cTeam.BenchmarkResults(now)
			if len(results) < len(item.GetScores()) {
				AdminLogger.Printf("at %s team %d / got(%d) expect(%d)\n", now, team.GetId(), len(item.GetScores()), len(results))
				return errorInvalidResponse("グラフ上と記録されたスコアの数が一致しませんでした")
			}
			targetAt = now
		}

		results = cTeam.AllBenchmarkResults()

		cbs := int64(0) // チャートから計算したベストスコア
		cls := int64(0) // チャートから計算した直近スコア
		latestMarkedAt := targetAt
		for idx, score := range item.GetScores() {
			if len(results) <= idx {
				AdminLogger.Printf("at %s(%s) team %d / got(%d) expect(%d): %#v\n", targetAt, score.GetMarkedAt().AsTime(), team.GetId(), idx, len(results), score)
				return errorInvalidResponse("スコアグラフ内に存在するはずのないスコアが存在します")
			}
			result := results[idx]

			if result.Score != score.GetScore() {
				return errorInvalidResponse("スコアグラフ内のスコアが不正です")
			}

			markedAt := score.GetMarkedAt().AsTime()
			if !result.MarkedAt().Equal(markedAt) {
				AdminLogger.Printf("expect: %s / got: %s;", result.MarkedAt(), markedAt)
				return errorInvalidResponse("スコアグラフ内のスコアの終了時刻が不正です")
			}

			if cbs < result.Score {
				cbs = result.Score
			}
			cls = result.Score
			latestMarkedAt = markedAt
			if markedAt.After(maxMarkedAt) {
				maxMarkedAt = markedAt
			}
		}

		bs := item.GetBestScore().GetScore()
		ebs, ebt := cTeam.BestScore(latestMarkedAt)
		if bs != ebs && bs != cbs {
			AdminLogger.Printf("at %s(%s) team %d / got(%d) expect(%d) calc(%d)\n", targetAt, ebt, team.GetId(), bs, ebs, cbs)
			return errorInvalidResponse("ベストスコアの検証に失敗しました")
		}

		ls := item.GetLatestScore().GetScore()
		lm := item.GetLatestScore().GetMarkedAt().AsTime()
		els, elt := cTeam.LatestScore(latestMarkedAt)
		if ls != els && ls != cls {
			AdminLogger.Printf("at %s(%s) team %d / got(%d) expect(%d) calc(%d)\n", targetAt, elt, team.GetId(), ls, els, cls)
			return errorInvalidResponse("最新スコアの検証に失敗しました")
		}

		if ls > prevLatestScore || (!lm.Equal(zero) && ls == prevLatestScore && prevLatestMarkedAt.After(lm)) {
			AdminLogger.Printf("now(%d, %s) / prev(%d, %s)", ls, lm, prevLatestScore, prevLatestMarkedAt)
			return errorInvalidResponse("チームの並び順が間違っています")
		}
		prevLatestScore = ls
		prevLatestMarkedAt = item.GetLatestScore().GetMarkedAt().AsTime()
	}

	allowedMaxTime := requestedAt
	if requestedAt.After(sLatestMarkedAt) {
		allowedMaxTime = sLatestMarkedAt
	}

	if vTeam != nil {
		vMax := vTeam.MaximumMarkedAt()
		if allowedMaxTime.After(contest.ContestFreezesAt) && sLatestMarkedAt.After(vMax) {
			allowedMaxTime = vMax
		}
	}

	cacheTime := 2 * time.Second
	if allowCache {
		cacheTime = 3 * time.Second

		if allowedMaxTime.After(contest.ContestFreezesAt) {
			return nil
		}
	}

	if !maxMarkedAt.Equal(zero) && allowedMaxTime.Add(-cacheTime).After(maxMarkedAt) {
		AdminLogger.Printf("OLDER LEADERBOARD: \n  %s requested at\n  %s latest finish\n  %s allowed cache time\n  %s leadeboard max time\n  %s frozen time\n", requestedAt, sLatestMarkedAt, allowedMaxTime.Add(-cacheTime), maxMarkedAt, time.Now().UTC())
		return errorInvalidResponse("規定より古い内容のリーダーボードが返却されています")
	}

	return nil
}

func (s *Scenario) handleInvalidPush(id string, err error, step *isucandar.BenchmarkStep) {
	step.AddError(failure.NewError(ErrWebPush, fmt.Errorf("不正な Web Push メッセージの送信がありました (/push/%s): %w", id, err)))
}

func verifyGetBenchmarkJobDetail(res *contestant.GetBenchmarkJobResponse, team *model.Team, result *model.BenchmarkResult) error {
	rjob := res.GetJob()
	if !AssertEqual("Benchmark Job ID Check", result.ID(), rjob.GetId()) {
		return errorInvalidResponse("不正なベンチマークジョブ ID")
	}

	if !AssertEqual("Benchmark Job Team ID Check", team.ID, rjob.GetTeamId()) {
		return errorInvalidResponse("不正なチーム ID")
	}

	if !AssertEqual("Benchmark Job Status Check", resources.BenchmarkJob_FINISHED, rjob.GetStatus()) {
		return errorInvalidResponse("不正な終了ステータス")
	}

	rresult := rjob.GetResult()
	if !AssertEqual("Benchmark Job Pass Check", result.Passed, rresult.GetPassed()) {
		return errorInvalidResponse("不正な成功フラグ")
	}

	if !AssertEqual("Benchmark Job Score Check", result.Score, rresult.GetScore()) {
		return errorInvalidResponse("不正なスコア")
	}

	rbreakdown := rresult.GetScoreBreakdown()
	if !AssertEqual("Benchmark Job Score Raw Check", result.ScoreRaw, rbreakdown.GetRaw()) {
		return errorInvalidResponse("不正な基礎スコア")
	}

	if !AssertEqual("Benchmark Job Score Deduction Check", result.ScoreDeduction, rbreakdown.GetDeduction()) {
		return errorInvalidResponse("不正な減点スコア")
	}

	mt := rjob.GetFinishedAt().AsTime()
	if !AssertEqual("Benchmark Job Finished At Check", result.MarkedAt(), mt) {
		return errorInvalidResponse("不正な終了時刻")
	}

	return nil
}
