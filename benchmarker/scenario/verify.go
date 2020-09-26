package scenario

import (
	"crypto/sha512"
	"fmt"
	"io/ioutil"
	"math"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/isucon/isucandar"
	"github.com/isucon/isucon10-final/benchmarker/model"
	"github.com/isucon/isucon10-final/benchmarker/proto/xsuportal/resources"

	"github.com/isucon/isucandar/agent"
	"github.com/isucon/isucandar/failure"
	"github.com/isucon/isucon10-final/benchmarker/proto/xsuportal/services/admin"
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
		fmt.Printf("resource not found: %s on %s\n", name, base)
		return failure.NewError(ErrChecksum, errorInvalidResponse("チェックサムの取得に失敗しました: %s", name))
	}

	if resource.Error != nil {
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
		fmt.Printf("%v\n", err)
		return failure.NewError(ErrChecksum, errorInvalidResponse("チェックサムの取得に失敗しました: %s", path))
	}
	if fmt.Sprintf("%x", sha512.Sum384(bytes)) != checksums[path] {
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
	if len(errs) > 0 {

		fmt.Printf("%s: resources: %d\n", page, len(resources))
		for k, r := range resources {
			fmt.Printf("%s: %s: %s\n", page, r.InitiatorType, k)
		}
	}
	return errs
}

func verifyLeaderboard(requestedAt time.Time, leaderboard *resources.Leaderboard, hres *http.Response, contest *model.Contest, vTeam *model.Team) error {
	at := requestedAt.UTC()
	// TODO: 時間詐欺が出来るので直す
	if t, err := http.ParseTime(hres.Header.Get("Last-Modified")); err != nil && hres.Header.Get("Last-Modified") != "" {
		at = t
	}

	prevLatestScore := int64(math.MaxInt64)
	prevLatestMarkedAt := time.Now().UTC().Add(1 * time.Hour)
	zero := time.Unix(0, 0)
	for _, item := range leaderboard.GetTeams() {
		team := item.GetTeam()
		cTeam := contest.GetTeam(team.GetId())
		if cTeam == nil {
			return failure.NewError(ErrCritical, errorInvalidResponse("登録されていないチームがリーダーボード上に存在します: ID %d", team.GetId()))
		}

		if team.GetStudent().GetStatus() != cTeam.IsStudent {
			return errorInvalidResponse("学生チームかどうかの判定が不正です")
		}

		targetAt := at
		if !(vTeam != nil && vTeam.ID == cTeam.ID) && (at.After(contest.ContestFreezesAt) || at.Equal(contest.ContestFreezesAt)) {
			targetAt = contest.ContestFreezesAt.UTC()
		}

		results := cTeam.BenchmarkResults(targetAt)

		if len(results) > len(item.GetScores()) {
			fmt.Printf("at %s team %d / got(%d) expect(%d)\n", targetAt, team.GetId(), len(item.GetScores()), len(results))
			now := time.Now().UTC()
			results = cTeam.BenchmarkResults(now)
			if len(results) != len(item.GetScores()) {
				fmt.Printf("at %s team %d / got(%d) expect(%d)\n", now, team.GetId(), len(item.GetScores()), len(results))
				// fmt.Printf("%v\n", cTeam.AllBenchmarkResults())
				// os.Exit(1)
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
				// TODO: あとで標準エラーに
				fmt.Printf("at %s(%s) team %d / got(%d) expect(%d): %#v\n", targetAt, score.GetMarkedAt().AsTime(), team.GetId(), idx, len(results), score)
				return errorInvalidResponse("スコアグラフ内に存在するはずのないスコアが存在します")
			}
			result := results[idx]

			if result.Score != score.GetScore() {
				return errorInvalidResponse("スコアグラフ内のスコアが不正です")
			}

			markedAt := score.GetMarkedAt().AsTime()
			if !result.MarkedAt().Equal(markedAt) {
				fmt.Printf("expect: %s / got: %s;", result.MarkedAt(), markedAt)
				return errorInvalidResponse("スコアグラフ内のスコアの終了時刻が不正です")
			}

			if cbs < result.Score {
				cbs = result.Score
			}
			cls = result.Score
			latestMarkedAt = markedAt
		}

		bs := item.GetBestScore().GetScore()
		ebs, ebt := cTeam.BestScore(latestMarkedAt)
		if bs != ebs && bs != cbs {
			// TODO: あとで標準エラーに
			fmt.Printf("at %s(%s) team %d / got(%d) expect(%d) calc(%d)\n", targetAt, ebt, team.GetId(), bs, ebs, cbs)
			return errorInvalidResponse("ベストスコアの検証に失敗しました")
		}

		ls := item.GetLatestScore().GetScore()
		lm := item.GetLatestScore().GetMarkedAt().AsTime()
		els, elt := cTeam.LatestScore(latestMarkedAt)
		if ls != els && ls != cls {
			// TODO: あとで標準エラーに
			fmt.Printf("at %s(%s) team %d / got(%d) expect(%d) calc(%d)\n", targetAt, elt, team.GetId(), ls, els, cls)
			return errorInvalidResponse("最新スコアの検証に失敗しました")
		}

		if ls > prevLatestScore || (!lm.Equal(zero) && ls == prevLatestScore && prevLatestMarkedAt.After(lm)) {
			fmt.Printf("now(%d, %s) / prev(%d, %s)", ls, lm, prevLatestScore, prevLatestMarkedAt)
			return errorInvalidResponse("チームの並び順が間違っています")
		}
		prevLatestScore = ls
		prevLatestMarkedAt = item.GetLatestScore().GetMarkedAt().AsTime()
	}

	return nil
}

func (s *Scenario) handleInvalidPush(id string, err error, step *isucandar.BenchmarkStep) {
	step.AddError(failure.NewError(ErrWebPush, fmt.Errorf("不正な Web Push メッセージの送信がありました (/push/%s): %w", id, err)))
}
