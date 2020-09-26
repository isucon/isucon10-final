package main

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"crypto/subtle"
	"database/sql"
	"encoding/base64"
	"encoding/hex"
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/go-sql-driver/mysql"
	"github.com/golang/protobuf/proto"
	"github.com/gorilla/sessions"
	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"google.golang.org/protobuf/types/known/timestamppb"

	xsuportal "github.com/isucon/isucon10-final/webapp/golang"
	xsuportalpb "github.com/isucon/isucon10-final/webapp/golang/proto/xsuportal"
	"github.com/isucon/isucon10-final/webapp/golang/proto/xsuportal/resources"
	"github.com/isucon/isucon10-final/webapp/golang/proto/xsuportal/services/admin"
	"github.com/isucon/isucon10-final/webapp/golang/proto/xsuportal/services/audience"
	"github.com/isucon/isucon10-final/webapp/golang/proto/xsuportal/services/common"
	contestantpb "github.com/isucon/isucon10-final/webapp/golang/proto/xsuportal/services/contestant"
	"github.com/isucon/isucon10-final/webapp/golang/proto/xsuportal/services/registration"
	"github.com/isucon/isucon10-final/webapp/golang/util"
)

const (
	TeamCapacity               = 10
	AdminID                    = "admin"
	AdminPassword              = "admin"
	DebugContestStatusFilePath = "/tmp/XSUPORTAL_CONTEST_STATUS"
	MYSQL_ER_DUP_ENTRY         = 1062
)

var db *sqlx.DB
var notifier xsuportal.Notifier

func main() {
	srv := echo.New()
	srv.Debug = util.GetEnv("DEBUG", "") != ""
	srv.HideBanner = true

	srv.Binder = ProtoBinder{}
	srv.HTTPErrorHandler = func(err error, c echo.Context) {
		if !c.Response().Committed {
			c.Logger().Error(c.Request().Method, " ", c.Request().URL.Path, " ", err)
			_ = halt(c, http.StatusInternalServerError, "", err)
		}
	}

	srv.Use(middleware.Logger())
	srv.Use(middleware.Recover())
	srv.Use(session.Middleware(sessions.NewCookieStore([]byte("tagomoris"))))

	srv.File("/", "public/audience.html")
	srv.File("/registration", "public/audience.html")
	srv.File("/signup", "public/audience.html")
	srv.File("/login", "public/audience.html")
	srv.File("/logout", "public/audience.html")
	srv.File("/teams", "public/audience.html")

	srv.File("/contestant", "public/contestant.html")
	srv.File("/contestant/benchmark_jobs", "public/contestant.html")
	srv.File("/contestant/benchmark_jobs/:id", "public/contestant.html")
	srv.File("/contestant/clarifications", "public/contestant.html")

	srv.File("/admin", "public/admin.html")
	srv.File("/admin/", "public/admin.html")
	srv.File("/admin/clarifications", "public/admin.html")
	srv.File("/admin/clarifications/:id", "public/admin.html")

	srv.Static("/", "public")

	srv.POST("/initialize", initialize)

	srv.GET("/api/admin/clarifications", func(e echo.Context) error {
		if ok, err := loginRequired(e, db, &loginRequiredOption{}); !ok {
			return wrapError("check session", err)
		}
		contestant, _ := getCurrentContestant(e, db, false)
		if !contestant.Staff {
			return halt(e, http.StatusForbidden, "管理者権限が必要です", nil)
		}
		var clarifications []xsuportal.Clarification
		err := db.Select(&clarifications, "SELECT * FROM `clarifications` ORDER BY `updated_at` DESC")
		if err != sql.ErrNoRows && err != nil {
			return fmt.Errorf("query clarifications: %w", err)
		}
		res := &admin.ListClarificationsResponse{}
		for _, clarification := range clarifications {
			var team xsuportal.Team
			err := db.Get(
				&team,
				"SELECT * FROM `teams` WHERE `id` = ? LIMIT 1",
				clarification.TeamID,
			)
			if err != nil {
				return fmt.Errorf("query team(id=%v, clarification=%v): %w", clarification.TeamID, clarification.ID, err)
			}
			c, err := makeClarificationPB(db, &clarification, &team)
			if err != nil {
				return fmt.Errorf("make clarification: %w", err)
			}
			res.Clarifications = append(res.Clarifications, c)
		}
		return writeProto(e, http.StatusOK, res)
	})

	srv.GET("/api/admin/clarifications/:id", func(e echo.Context) error {
		if ok, err := loginRequired(e, db, &loginRequiredOption{}); !ok {
			return wrapError("check session", err)
		}
		id, err := strconv.Atoi(e.Param("id"))
		if err != nil {
			return fmt.Errorf("parse id: %w", err)
		}
		contestant, _ := getCurrentContestant(e, db, false)
		if !contestant.Staff {
			return halt(e, http.StatusForbidden, "管理者権限が必要です", nil)
		}
		var clarification xsuportal.Clarification
		err = db.Get(
			&clarification,
			"SELECT * FROM `clarifications` WHERE `id` = ? LIMIT 1",
			id,
		)
		if err != nil {
			return fmt.Errorf("get clarification: %w", err)
		}
		var team xsuportal.Team
		err = db.Get(
			&team,
			"SELECT * FROM `teams` WHERE id = ? LIMIT 1",
			clarification.TeamID,
		)
		if err != nil {
			return fmt.Errorf("get team: %w", err)
		}
		c, err := makeClarificationPB(db, &clarification, &team)
		if err != nil {
			return fmt.Errorf("make clarification: %w", err)
		}
		return writeProto(e, http.StatusOK, &admin.GetClarificationResponse{
			Clarification: c,
		})
	})

	srv.PUT("/api/admin/clarifications/:id", func(e echo.Context) error {
		if ok, err := loginRequired(e, db, &loginRequiredOption{}); !ok {
			return wrapError("check session", err)
		}
		id, err := strconv.Atoi(e.Param("id"))
		if err != nil {
			return fmt.Errorf("parse id: %w", err)
		}
		contestant, _ := getCurrentContestant(e, db, false)
		if !contestant.Staff {
			return halt(e, http.StatusForbidden, "管理者権限が必要です", nil)
		}
		var req admin.RespondClarificationRequest
		if err := e.Bind(&req); err != nil {
			return err
		}

		tx, err := db.Beginx()
		if err != nil {
			return fmt.Errorf("begin tx: %w", err)
		}
		defer tx.Rollback()

		var clarificationBefore xsuportal.Clarification
		err = tx.Get(
			&clarificationBefore,
			"SELECT * FROM `clarifications` WHERE `id` = ? LIMIT 1 FOR UPDATE",
			id,
		)
		if err == sql.ErrNoRows {
			return halt(e, http.StatusNotFound, "質問が見つかりません", nil)
		}
		if err != nil {
			return fmt.Errorf("get clarification with lock: %w", err)
		}
		wasAnswered := clarificationBefore.AnsweredAt.Valid
		wasDisclosed := clarificationBefore.Disclosed

		_, err = tx.Exec(
			"UPDATE `clarifications` SET `disclosed` = ?, `answer` = ?, `updated_at` = NOW(6), `answered_at` = NOW(6) WHERE `id` = ? LIMIT 1",
			req.Disclose,
			req.Answer,
			id,
		)
		if err != nil {
			return fmt.Errorf("update clarification: %w", err)
		}
		var clarification xsuportal.Clarification
		err = tx.Get(
			&clarification,
			"SELECT * FROM `clarifications` WHERE `id` = ? LIMIT 1",
			id,
		)
		if err != nil {
			return fmt.Errorf("get clarification: %w", err)
		}
		var team xsuportal.Team
		err = tx.Get(
			&team,
			"SELECT * FROM `teams` WHERE `id` = ? LIMIT 1",
			clarification.TeamID,
		)
		if err != nil {
			return fmt.Errorf("get team: %w", err)
		}
		c, err := makeClarificationPB(tx, &clarification, &team)
		if err != nil {
			return fmt.Errorf("make clarification: %w", err)
		}
		if err := tx.Commit(); err != nil {
			return fmt.Errorf("commit tx: %w", err)
		}
		updated := wasAnswered && wasDisclosed == clarification.Disclosed
		if err := notifier.NotifyClarificationAnswered(db, &clarification, updated); err != nil {
			return fmt.Errorf("notify clarification answered: %w", err)
		}
		return writeProto(e, http.StatusOK, &admin.RespondClarificationResponse{
			Clarification: c,
		})
	})

	srv.GET("/api/session", func(e echo.Context) error {
		res := &common.GetCurrentSessionResponse{}
		currentContestant, err := getCurrentContestant(e, db, false)
		if err != nil {
			return fmt.Errorf("get current contestant: %w", err)
		}
		if currentContestant != nil {
			res.Contestant = makeContestantPB(currentContestant)
		}
		currentTeam, err := getCurrentTeam(e, db, false)
		if err != nil {
			return fmt.Errorf("get current team: %w", err)
		}
		if currentTeam != nil {
			res.Team, err = makeTeamPB(db, currentTeam, true, true)
			if err != nil {
				return fmt.Errorf("make team: %w", err)
			}
		}
		res.Contest, err = makeContestPB(e)
		if err != nil {
			return fmt.Errorf("make contest: %w", err)
		}
		vapidKey := notifier.VAPIDKey()
		if vapidKey != nil {
			res.PushVapidKey = vapidKey.VAPIDPublicKey
		}
		return writeProto(e, http.StatusOK, res)
	})

	srv.GET("/api/audience/teams", func(e echo.Context) error {
		var teams []xsuportal.Team
		err := db.Select(&teams, "SELECT * FROM `teams` WHERE `withdrawn` = FALSE ORDER BY `created_at` DESC")
		if err != nil {
			return fmt.Errorf("select teams: %w", err)
		}
		res := &audience.ListTeamsResponse{}
		for _, team := range teams {
			var members []xsuportal.Contestant
			err := db.Select(
				&members,
				"SELECT * FROM `contestants` WHERE `team_id` = ? ORDER BY `created_at`",
				team.ID,
			)
			if err != nil {
				return fmt.Errorf("select members(team_id=%v): %w", team.ID, err)
			}
			var memberNames []string
			isStudent := true
			for _, member := range members {
				memberNames = append(memberNames, member.Name.String)
				isStudent = isStudent && member.Student
			}
			res.Teams = append(res.Teams, &audience.ListTeamsResponse_TeamListItem{
				TeamId:      team.ID,
				Name:        team.Name,
				MemberNames: memberNames,
				IsStudent:   isStudent,
			})
		}
		return writeProto(e, http.StatusOK, res)
	})

	srv.GET("/api/audience/dashboard", func(e echo.Context) error {
		leaderboard, err := makeLeaderboardPB(e, 0)
		if err != nil {
			return fmt.Errorf("make leaderboard: %w", err)
		}
		return writeProto(e, http.StatusOK, &audience.DashboardResponse{
			Leaderboard: leaderboard,
		})
	})

	srv.GET("/api/registration/session", func(e echo.Context) error {
		var team *xsuportal.Team

		currentTeam, err := getCurrentTeam(e, db, false)
		if err != nil {
			return fmt.Errorf("get current team: %w", err)
		}
		team = currentTeam
		if team == nil {
			teamIDStr := e.QueryParam("team_id")
			inviteToken := e.QueryParam("invite_token")
			if teamIDStr != "" && inviteToken != "" {
				teamID, err := strconv.Atoi(teamIDStr)
				if err != nil {
					return fmt.Errorf("parse team id: %w", err)
				}
				var t xsuportal.Team
				err = db.Get(
					&t,
					"SELECT * FROM `teams` WHERE `id` = ? AND `invite_token` = ? AND `withdrawn` = FALSE LIMIT 1",
					teamID,
					inviteToken,
				)
				if err == sql.ErrNoRows {
					return halt(e, http.StatusNotFound, "招待URLが無効です", nil)
				}
				if err != nil {
					return fmt.Errorf("get team: %w", err)
				}
				team = &t
			}
		}

		var members []xsuportal.Contestant
		if team != nil {
			err := db.Select(
				&members,
				"SELECT * FROM `contestants` WHERE `team_id` = ?",
				team.ID,
			)
			if err != nil {
				return fmt.Errorf("select members: %w", err)
			}
		}

		res := &registration.GetRegistrationSessionResponse{
			Status: 0,
		}
		contestant, err := getCurrentContestant(e, db, false)
		if err != nil {
			return fmt.Errorf("get current contestant: %w", err)
		}
		switch {
		case contestant != nil && contestant.TeamID.Valid:
			res.Status = registration.GetRegistrationSessionResponse_JOINED
		case team != nil && len(members) >= 3:
			res.Status = registration.GetRegistrationSessionResponse_NOT_JOINABLE
		case contestant == nil:
			res.Status = registration.GetRegistrationSessionResponse_NOT_LOGGED_IN
		case team != nil:
			res.Status = registration.GetRegistrationSessionResponse_JOINABLE
		case team == nil:
			res.Status = registration.GetRegistrationSessionResponse_CREATABLE
		default:
			return fmt.Errorf("undeterminable status")
		}
		if team != nil {
			res.Team, err = makeTeamPB(db, team, contestant != nil && currentTeam != nil && contestant.ID == currentTeam.LeaderID.String, true)
			if err != nil {
				return fmt.Errorf("make team: %w", err)
			}
			res.MemberInviteUrl = fmt.Sprintf("/registration?team_id=%v&invite_token=%v", team.ID, team.InviteToken)
			res.InviteToken = team.InviteToken
		}
		return writeProto(e, http.StatusOK, res)
	})

	srv.POST("/api/registration/team", func(e echo.Context) error {
		var req registration.CreateTeamRequest
		if err := e.Bind(&req); err != nil {
			return err
		}
		if ok, err := loginRequired(e, db, &loginRequiredOption{}); !ok {
			return wrapError("check session", err)
		}
		ok, err := contestStatusRestricted(e, db, resources.Contest_REGISTRATION, "チーム登録期間ではありません")
		if !ok {
			return wrapError("check contest status", err)
		}

		ctx := context.Background()
		conn, err := db.Connx(ctx)
		if err != nil {
			return fmt.Errorf("get conn: %w", err)
		}
		defer conn.Close()

		_, err = conn.ExecContext(ctx, "LOCK TABLES `teams` WRITE, `contestants` WRITE")
		if err != nil {
			return fmt.Errorf("lock tables: %w", err)
		}
		defer conn.ExecContext(ctx, "UNLOCK TABLES")

		randomBytes := make([]byte, 64)
		_, err = rand.Read(randomBytes)
		if err != nil {
			return fmt.Errorf("read random: %w", err)
		}
		inviteToken := base64.URLEncoding.EncodeToString(randomBytes)
		var withinCapacity bool
		err = conn.QueryRowContext(
			ctx,
			"SELECT COUNT(*) < ? AS `within_capacity` FROM `teams`",
			TeamCapacity,
		).Scan(&withinCapacity)
		if err != nil {
			return fmt.Errorf("check capacity: %w", err)
		}
		if !withinCapacity {
			return halt(e, http.StatusForbidden, "チーム登録数上限です", nil)
		}
		_, err = conn.ExecContext(
			ctx,
			"INSERT INTO `teams` (`name`, `email_address`, `invite_token`, `created_at`) VALUES (?, ?, ?, NOW(6))",
			req.TeamName,
			req.EmailAddress,
			inviteToken,
		)
		if err != nil {
			return fmt.Errorf("insert team: %w", err)
		}
		var teamID int64
		err = conn.QueryRowContext(
			ctx,
			"SELECT LAST_INSERT_ID() AS `id`",
		).Scan(&teamID)
		if err != nil || teamID == 0 {
			return halt(e, http.StatusInternalServerError, "チームを登録できませんでした", nil)
		}

		contestant, _ := getCurrentContestant(e, db, false)

		_, err = conn.ExecContext(
			ctx,
			"UPDATE `contestants` SET `name` = ?, `student` = ?, `team_id` = ? WHERE id = ? LIMIT 1",
			req.Name,
			req.IsStudent,
			teamID,
			contestant.ID,
		)
		if err != nil {
			return fmt.Errorf("update contestant: %w", err)
		}

		_, err = conn.ExecContext(
			ctx,
			"UPDATE `teams` SET `leader_id` = ? WHERE `id` = ? LIMIT 1",
			contestant.ID,
			teamID,
		)
		if err != nil {
			return fmt.Errorf("update team: %w", err)
		}

		return writeProto(e, http.StatusOK, &registration.CreateTeamResponse{
			TeamId: teamID,
		})
	})

	srv.POST("/api/registration/contestant", func(e echo.Context) error {
		var req registration.JoinTeamRequest
		if err := e.Bind(&req); err != nil {
			return err
		}
		tx, err := db.Beginx()
		if err != nil {
			return fmt.Errorf("begin tx: %w", err)
		}
		defer tx.Rollback()

		if ok, err := loginRequired(e, tx, &loginRequiredOption{Lock: true}); !ok {
			return wrapError("check session", err)
		}
		if ok, err := contestStatusRestricted(e, tx, resources.Contest_REGISTRATION, "チーム登録期間ではありません"); !ok {
			return wrapError("check contest status", err)
		}
		var team xsuportal.Team
		err = tx.Get(
			&team,
			"SELECT * FROM `teams` WHERE `id` = ? AND `invite_token` = ? AND `withdrawn` = FALSE LIMIT 1 FOR UPDATE",
			req.TeamId,
			req.InviteToken,
		)
		if err == sql.ErrNoRows {
			return halt(e, http.StatusBadRequest, "招待URLが不正です", nil)
		}
		if err != nil {
			return fmt.Errorf("get team with lock: %w", err)
		}
		var memberCount int
		err = tx.Get(
			&memberCount,
			"SELECT COUNT(*) AS `cnt` FROM `contestants` WHERE `team_id` = ?",
			req.TeamId,
		)
		if err != nil {
			return fmt.Errorf("count team member: %w", err)
		}
		if memberCount >= 3 {
			return halt(e, http.StatusBadRequest, "チーム人数の上限に達しています", nil)
		}

		contestant, _ := getCurrentContestant(e, tx, false)
		_, err = tx.Exec(
			"UPDATE `contestants` SET `team_id` = ?, `name` = ?, `student` = ? WHERE `id` = ? LIMIT 1",
			req.TeamId,
			req.Name,
			req.IsStudent,
			contestant.ID,
		)
		if err != nil {
			return fmt.Errorf("update contestant: %w", err)
		}
		if err := tx.Commit(); err != nil {
			return fmt.Errorf("commit tx: %w", err)
		}
		return writeProto(e, http.StatusOK, &registration.JoinTeamResponse{})
	})

	srv.PUT("/api/registration", func(e echo.Context) error {
		var req registration.UpdateRegistrationRequest
		if err := e.Bind(&req); err != nil {
			return err
		}
		tx, err := db.Beginx()
		if err != nil {
			return fmt.Errorf("begin tx: %w", err)
		}
		defer tx.Rollback()
		if ok, err := loginRequired(e, tx, &loginRequiredOption{Team: true, Lock: true}); !ok {
			return wrapError("check session", err)
		}
		team, _ := getCurrentTeam(e, tx, false)
		contestant, _ := getCurrentContestant(e, tx, false)
		if team.LeaderID.Valid && team.LeaderID.String == contestant.ID {
			_, err := tx.Exec(
				"UPDATE `teams` SET `name` = ?, `email_address` = ? WHERE `id` = ? LIMIT 1",
				req.TeamName,
				req.EmailAddress,
				team.ID,
			)
			if err != nil {
				return fmt.Errorf("update team: %w", err)
			}
		}
		_, err = tx.Exec(
			"UPDATE `contestants` SET `name` = ?, `student` = ? WHERE `id` = ? LIMIT 1",
			req.Name,
			req.IsStudent,
			contestant.ID,
		)
		if err != nil {
			return fmt.Errorf("update contestant: %w", err)
		}
		if err := tx.Commit(); err != nil {
			return fmt.Errorf("commit tx: %w", err)
		}
		return writeProto(e, http.StatusOK, &registration.UpdateRegistrationResponse{})
	})

	srv.DELETE("/api/registration", func(e echo.Context) error {
		tx, err := db.Beginx()
		if err != nil {
			return fmt.Errorf("begin tx: %w", err)
		}
		defer tx.Rollback()
		if ok, err := loginRequired(e, tx, &loginRequiredOption{Team: true, Lock: true}); !ok {
			return wrapError("check session", err)
		}
		if ok, err := contestStatusRestricted(e, tx, resources.Contest_REGISTRATION, "チーム登録期間外は辞退できません"); !ok {
			return wrapError("check contest status", err)
		}
		team, _ := getCurrentTeam(e, tx, false)
		contestant, _ := getCurrentContestant(e, tx, false)
		if team.LeaderID.Valid && team.LeaderID.String == contestant.ID {
			_, err := tx.Exec(
				"UPDATE `teams` SET `withdrawn` = TRUE, `leader_id` = NULL WHERE `id` = ? LIMIT 1",
				team.ID,
			)
			if err != nil {
				return fmt.Errorf("withdrawn team(id=%v): %w", team.ID, err)
			}
			_, err = tx.Exec(
				"UPDATE `contestants` SET `team_id` = NULL WHERE `team_id` = ?",
				team.ID,
			)
			if err != nil {
				return fmt.Errorf("withdrawn members(team_id=%v): %w", team.ID, err)
			}
		} else {
			_, err := tx.Exec(
				"UPDATE `contestants` SET `team_id` = NULL WHERE `id` = ? LIMIT 1",
				contestant.ID,
			)
			if err != nil {
				return fmt.Errorf("withdrawn contestant(id=%v): %w", contestant.ID, err)
			}
		}
		if err := tx.Commit(); err != nil {
			return fmt.Errorf("commit tx: %w", err)
		}
		return writeProto(e, http.StatusOK, &registration.DeleteRegistrationResponse{})
	})

	srv.POST("/api/contestant/benchmark_jobs", func(e echo.Context) error {
		var req contestantpb.EnqueueBenchmarkJobRequest
		if err := e.Bind(&req); err != nil {
			return err
		}
		tx, err := db.Beginx()
		if err != nil {
			return fmt.Errorf("begin tx: %w", err)
		}
		defer tx.Rollback()
		if ok, err := loginRequired(e, tx, &loginRequiredOption{Team: true}); !ok {
			return wrapError("check session", err)
		}
		if ok, err := contestStatusRestricted(e, tx, resources.Contest_STARTED, "競技時間外はベンチマークを実行できません"); !ok {
			return wrapError("check contest status", err)
		}
		team, _ := getCurrentTeam(e, tx, false)
		var jobCount int
		err = tx.Get(
			&jobCount,
			"SELECT COUNT(*) AS `cnt` FROM `benchmark_jobs` WHERE `team_id` = ? AND `finished_at` IS NULL",
			team.ID,
		)
		if err != nil {
			return fmt.Errorf("count benchmark job: %w", err)
		}
		if jobCount > 0 {
			return halt(e, http.StatusForbidden, "既にベンチマークを実行中です", nil)
		}
		_, err = tx.Exec(
			"INSERT INTO `benchmark_jobs` (`team_id`, `target_hostname`, `status`, `updated_at`, `created_at`) VALUES (?, ?, ?, NOW(6), NOW(6))",
			team.ID,
			req.TargetHostname,
			int(resources.BenchmarkJob_PENDING),
		)
		if err != nil {
			return fmt.Errorf("enqueue benchmark job: %w", err)
		}
		var job xsuportal.BenchmarkJob
		err = tx.Get(
			&job,
			"SELECT * FROM `benchmark_jobs` WHERE `id` = (SELECT LAST_INSERT_ID()) LIMIT 1",
		)
		if err != nil {
			return fmt.Errorf("get benchmark job: %w", err)
		}
		if err := tx.Commit(); err != nil {
			return fmt.Errorf("commit tx: %w", err)
		}
		j := makeBenchmarkJobPB(&job)
		return writeProto(e, http.StatusOK, &contestantpb.EnqueueBenchmarkJobResponse{
			Job: j,
		})
	})

	srv.GET("/api/contestant/benchmark_jobs", func(e echo.Context) error {
		if ok, err := loginRequired(e, db, &loginRequiredOption{Team: true}); !ok {
			return wrapError("check session", err)
		}
		jobs, err := makeBenchmarkJobsPB(e, db, 0)
		if err != nil {
			return fmt.Errorf("make benchmark jobs: %w", err)
		}
		return writeProto(e, http.StatusOK, &contestantpb.ListBenchmarkJobsResponse{
			Jobs: jobs,
		})
	})

	srv.GET("/api/contestant/benchmark_jobs/:id", func(e echo.Context) error {
		if ok, err := loginRequired(e, db, &loginRequiredOption{Team: true}); !ok {
			return wrapError("check session", err)
		}
		id, err := strconv.Atoi(e.Param("id"))
		if err != nil {
			return fmt.Errorf("parse id: %w", err)
		}
		team, _ := getCurrentTeam(e, db, false)
		var job xsuportal.BenchmarkJob
		err = db.Get(
			&job,
			"SELECT * FROM `benchmark_jobs` WHERE `team_id` = ? AND `id` = ? LIMIT 1",
			team.ID,
			id,
		)
		if err == sql.ErrNoRows {
			return halt(e, http.StatusNotFound, "ベンチマークジョブが見つかりません", nil)
		}
		if err != nil {
			return fmt.Errorf("get benchmark job: %w", err)
		}
		return writeProto(e, http.StatusOK, &contestantpb.GetBenchmarkJobResponse{
			Job: makeBenchmarkJobPB(&job),
		})
	})

	srv.GET("/api/contestant/clarifications", func(e echo.Context) error {
		if ok, err := loginRequired(e, db, &loginRequiredOption{Team: true}); !ok {
			return wrapError("check session", err)
		}
		team, _ := getCurrentTeam(e, db, false)
		var clarifications []xsuportal.Clarification
		err := db.Select(
			&clarifications,
			"SELECT * FROM `clarifications` WHERE `team_id` = ? OR `disclosed` = TRUE ORDER BY `id` DESC",
			team.ID,
		)
		if err != sql.ErrNoRows && err != nil {
			return fmt.Errorf("select clarifications: %w", err)
		}
		res := &contestantpb.ListClarificationsResponse{}
		for _, clarification := range clarifications {
			var team xsuportal.Team
			err := db.Get(
				&team,
				"SELECT * FROM `teams` WHERE `id` = ? LIMIT 1",
				clarification.TeamID,
			)
			if err != nil {
				return fmt.Errorf("get team(id=%v): %w", clarification.TeamID, err)
			}
			c, err := makeClarificationPB(db, &clarification, &team)
			if err != nil {
				return fmt.Errorf("make clarification: %w", err)
			}
			res.Clarifications = append(res.Clarifications, c)
		}
		return writeProto(e, http.StatusOK, res)
	})

	srv.POST("/api/contestant/clarifications", func(e echo.Context) error {
		if ok, err := loginRequired(e, db, &loginRequiredOption{Team: true}); !ok {
			return wrapError("check session", err)
		}
		var req contestantpb.RequestClarificationRequest
		if err := e.Bind(&req); err != nil {
			return err
		}
		tx, err := db.Beginx()
		if err != nil {
			return fmt.Errorf("begin tx: %w", err)
		}
		defer tx.Rollback()
		team, _ := getCurrentTeam(e, tx, false)
		_, err = tx.Exec(
			"INSERT INTO `clarifications` (`team_id`, `question`, `created_at`, `updated_at`) VALUES (?, ?, NOW(6), NOW(6))",
			team.ID,
			req.Question,
		)
		if err != nil {
			return fmt.Errorf("insert clarification: %w", err)
		}
		var clarification xsuportal.Clarification
		err = tx.Get(&clarification, "SELECT * FROM `clarifications` WHERE `id` = LAST_INSERT_ID() LIMIT 1")
		if err != nil {
			return fmt.Errorf("get clarification: %w", err)
		}
		if err := tx.Commit(); err != nil {
			return fmt.Errorf("commit tx: %w", err)
		}
		c, err := makeClarificationPB(db, &clarification, team)
		if err != nil {
			return fmt.Errorf("make clarification: %w", err)
		}
		return writeProto(e, http.StatusOK, &contestantpb.RequestClarificationResponse{
			Clarification: c,
		})
	})

	srv.GET("/api/contestant/dashboard", func(e echo.Context) error {
		if ok, err := loginRequired(e, db, &loginRequiredOption{Team: true}); !ok {
			return wrapError("check session", err)
		}
		team, _ := getCurrentTeam(e, db, false)
		leaderboard, err := makeLeaderboardPB(e, team.ID)
		if err != nil {
			return fmt.Errorf("make leaderboard: %w", err)
		}
		return writeProto(e, http.StatusOK, &contestantpb.DashboardResponse{
			Leaderboard: leaderboard,
		})
	})

	srv.GET("/api/contestant/notifications", func(e echo.Context) error {
		if ok, err := loginRequired(e, db, &loginRequiredOption{Team: true}); !ok {
			return wrapError("check session", err)
		}

		afterStr := e.QueryParam("after")

		tx, err := db.Beginx()
		if err != nil {
			return fmt.Errorf("begin tx: %w", err)
		}
		defer tx.Rollback()
		contestant, _ := getCurrentContestant(e, tx, false)

		var notifications []*xsuportal.Notification
		if afterStr != "" {
			after, err := strconv.Atoi(afterStr)
			if err != nil {
				return fmt.Errorf("parse after: %w", err)
			}
			err = tx.Select(
				&notifications,
				"SELECT * FROM `notifications` WHERE `contestant_id` = ? AND `id` > ? ORDER BY `id`",
				contestant.ID,
				after,
			)
			if err != sql.ErrNoRows && err != nil {
				return fmt.Errorf("select notifications(after=%v): %w", after, err)
			}
		} else {
			err = tx.Select(
				&notifications,
				"SELECT * FROM `notifications` WHERE `contestant_id` = ? ORDER BY `id`",
				contestant.ID,
			)
			if err != sql.ErrNoRows && err != nil {
				return fmt.Errorf("select notifications: %w", err)
			}
		}
		_, err = tx.Exec(
			"UPDATE `notifications` SET `read` = TRUE WHERE `contestant_id` = ? AND `read` = FALSE",
			contestant.ID,
		)
		if err != nil {
			return fmt.Errorf("update notifications: %w", err)
		}
		if err := tx.Commit(); err != nil {
			return fmt.Errorf("commit tx: %w", err)
		}
		team, _ := getCurrentTeam(e, db, false)

		var lastAnsweredClarificationID int64
		err = db.Get(
			&lastAnsweredClarificationID,
			"SELECT `id` FROM `clarifications` WHERE (`team_id` = ? OR `disclosed` = TRUE) AND `answered_at` IS NOT NULL ORDER BY `id` DESC LIMIT 1",
			team.ID,
		)
		if err != sql.ErrNoRows && err != nil {
			return fmt.Errorf("get last answered clarification: %w", err)
		}
		ns, err := makeNotificationsPB(notifications)
		if err != nil {
			return fmt.Errorf("make notifications: %w", err)
		}
		return writeProto(e, http.StatusOK, &contestantpb.ListNotificationsResponse{
			Notifications:               ns,
			LastAnsweredClarificationId: lastAnsweredClarificationID,
		})
	})

	srv.POST("/api/contestant/push_subscriptions", func(e echo.Context) error {
		if ok, err := loginRequired(e, db, &loginRequiredOption{Team: true}); !ok {
			return wrapError("check session", err)
		}

		if notifier.VAPIDKey() == nil {
			return halt(e, http.StatusForbidden, "WebPush は未対応です", nil)
		}

		var req contestantpb.SubscribeNotificationRequest
		if err := e.Bind(&req); err != nil {
			return err
		}

		contestant, _ := getCurrentContestant(e, db, false)
		_, err := db.Exec(
			"INSERT INTO `push_subscriptions` (`contestant_id`, `endpoint`, `p256dh`, `auth`, `created_at`, `updated_at`) VALUES (?, ?, ?, ?, NOW(6), NOW(6))",
			contestant.ID,
			req.Endpoint,
			req.P256Dh,
			req.Auth,
		)
		if err != nil {
			return fmt.Errorf("insert push_subscription: %w", err)
		}
		return writeProto(e, http.StatusOK, &contestantpb.SubscribeNotificationResponse{})
	})

	srv.DELETE("/api/contestant/push_subscriptions", func(e echo.Context) error {
		if ok, err := loginRequired(e, db, &loginRequiredOption{Team: true}); !ok {
			return wrapError("check session", err)
		}

		if notifier.VAPIDKey() == nil {
			return halt(e, http.StatusForbidden, "WebPush は未対応です", nil)
		}

		var req contestantpb.UnsubscribeNotificationRequest
		if err := e.Bind(&req); err != nil {
			return err
		}

		contestant, _ := getCurrentContestant(e, db, false)
		_, err := db.Exec(
			"DELETE FROM `push_subscriptions` WHERE `contestant_id` = ? AND `endpoint` = ? LIMIT 1",
			contestant.ID,
			req.Endpoint,
		)
		if err != nil {
			return fmt.Errorf("delete push_subscription: %w", err)
		}
		return writeProto(e, http.StatusOK, &contestantpb.UnsubscribeNotificationResponse{})
	})

	srv.POST("/api/signup", func(e echo.Context) error {
		var req contestantpb.SignupRequest
		if err := e.Bind(&req); err != nil {
			return err
		}

		hash := sha256.Sum256([]byte(req.Password))
		_, err := db.Exec(
			"INSERT INTO `contestants` (`id`, `password`, `staff`, `created_at`) VALUES (?, ?, FALSE, NOW(6))",
			req.ContestantId,
			hex.EncodeToString(hash[:]),
		)
		if mErr, ok := err.(*mysql.MySQLError); ok && mErr.Number == MYSQL_ER_DUP_ENTRY {
			return halt(e, http.StatusBadRequest, "IDが既に登録されています", nil)
		}
		if err != nil {
			return fmt.Errorf("insert contestant: %w", err)
		}
		sess, err := getSession(e)
		if err != nil {
			return fmt.Errorf("get session: %w", err)
		}
		sess.Options = &sessions.Options{
			Path:   "/",
			MaxAge: 3600,
		}
		sess.Values["contestant_id"] = req.ContestantId
		if err := sess.Save(e.Request(), e.Response()); err != nil {
			return fmt.Errorf("save session: %w", err)
		}
		return writeProto(e, http.StatusOK, &contestantpb.SignupResponse{})
	})

	srv.POST("/api/login", func(e echo.Context) error {
		var req contestantpb.LoginRequest
		if err := e.Bind(&req); err != nil {
			return err
		}
		var password string
		err := db.Get(
			&password,
			"SELECT `password` FROM `contestants` WHERE `id` = ? LIMIT 1",
			req.ContestantId,
		)
		if err != sql.ErrNoRows && err != nil {
			return fmt.Errorf("get contestant: %w", err)
		}
		passwordHash := sha256.Sum256([]byte(req.Password))
		digest := hex.EncodeToString(passwordHash[:])
		if err != sql.ErrNoRows && subtle.ConstantTimeCompare([]byte(digest), []byte(password)) == 1 {
			sess, err := getSession(e)
			if err != nil {
				return fmt.Errorf("get session: %w", err)
			}
			sess.Options = &sessions.Options{
				Path:   "/",
				MaxAge: 3600,
			}
			sess.Values["contestant_id"] = req.ContestantId
			if err := sess.Save(e.Request(), e.Response()); err != nil {
				return fmt.Errorf("save session: %w", err)
			}
		} else {
			return halt(e, http.StatusBadRequest, "ログインIDまたはパスワードが正しくありません", nil)
		}
		return writeProto(e, http.StatusOK, &contestantpb.LoginResponse{})
	})

	srv.POST("/api/logout", func(e echo.Context) error {
		sess, err := getSession(e)
		if err != nil {
			return fmt.Errorf("get session: %w", err)
		}
		if _, ok := sess.Values["contestant_id"]; ok {
			delete(sess.Values, "contestant_id")
			sess.Options = &sessions.Options{
				Path:   "/",
				MaxAge: 0,
			}
			if err := sess.Save(e.Request(), e.Response()); err != nil {
				return fmt.Errorf("delete session: %w", err)
			}
		} else {
			return halt(e, http.StatusUnauthorized, "ログインしていません", nil)
		}
		return writeProto(e, http.StatusOK, &contestantpb.LogoutResponse{})
	})

	address := fmt.Sprintf(":%v", util.GetEnv("PORT", "9292"))

	db, _ = xsuportal.GetDB()
	db.SetMaxOpenConns(10)

	srv.Logger.Error(srv.Start(address))
}

func initialize(e echo.Context) error {
	var req admin.InitializeRequest
	if err := e.Bind(&req); err != nil {
		return err
	}

	queries := []string{
		"TRUNCATE `teams`",
		"TRUNCATE `contestants`",
		"TRUNCATE `benchmark_jobs`",
		"TRUNCATE `clarifications`",
		"TRUNCATE `notifications`",
		"TRUNCATE `push_subscriptions`",
		"TRUNCATE `contest_config`",
	}
	for _, query := range queries {
		_, err := db.Exec(query)
		if err != nil {
			return fmt.Errorf("truncate table: %w", err)
		}
	}

	passwordHash := sha256.Sum256([]byte(AdminPassword))
	digest := hex.EncodeToString(passwordHash[:])
	_, err := db.Exec("INSERT `contestants` (`id`, `password`, `staff`, `created_at`) VALUES (?, ?, TRUE, NOW(6))", AdminID, digest)
	if err != nil {
		return fmt.Errorf("insert initial contestant: %w", err)
	}

	if req.Contest != nil {
		_, err := db.Exec(
			"INSERT `contest_config` (`registration_open_at`, `contest_starts_at`, `contest_freezes_at`, `contest_ends_at`) VALUES (?, ?, ?, ?)",
			time.Unix(req.Contest.RegistrationOpenAt.Seconds, 0).UTC(),
			time.Unix(req.Contest.ContestStartsAt.Seconds, 0).UTC(),
			time.Unix(req.Contest.ContestFreezesAt.Seconds, 0).UTC(),
			time.Unix(req.Contest.ContestEndsAt.Seconds, 0).UTC(),
		)
		if err != nil {
			return fmt.Errorf("insert contest: %w", err)
		}
	} else {
		_, err := db.Exec("INSERT `contest_config` (`registration_open_at`, `contest_starts_at`, `contest_freezes_at`, `contest_ends_at`) VALUES (TIMESTAMPADD(SECOND, 0, NOW(6)), TIMESTAMPADD(SECOND, 5, NOW(6)), TIMESTAMPADD(SECOND, 40, NOW(6)), TIMESTAMPADD(SECOND, 50, NOW(6)))")
		if err != nil {
			return fmt.Errorf("insert contest: %w", err)
		}
	}

	host := util.GetEnv("BENCHMARKER_SERVER_HOST", "localhost")
	port, _ := strconv.Atoi(util.GetEnv("BENCHMARKER_SERVER_PORT", "50051"))
	res := &admin.InitializeResponse{
		Language: "go",
		BenchmarkServer: &admin.InitializeResponse_BenchmarkServer{
			Host: host,
			Port: int64(port),
		},
	}
	return writeProto(e, http.StatusOK, res)
}

func getCurrentContestant(e echo.Context, db sqlx.Queryer, lock bool) (*xsuportal.Contestant, error) {
	xc := getXsuportalContext(e)
	if xc.Contestant != nil {
		return xc.Contestant, nil
	}
	sess, err := getSession(e)
	if err != nil {
		return nil, fmt.Errorf("get session: %w", err)
	}
	contestantID, ok := sess.Values["contestant_id"]
	if !ok {
		return nil, nil
	}
	var contestant xsuportal.Contestant
	query := "SELECT * FROM `contestants` WHERE `id` = ? LIMIT 1"
	if lock {
		query += " FOR UPDATE"
	}
	err = sqlx.Get(db, &contestant, query, contestantID)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("query contestant: %w", err)
	}
	xc.Contestant = &contestant
	return xc.Contestant, nil
}

func getCurrentTeam(e echo.Context, db sqlx.Queryer, lock bool) (*xsuportal.Team, error) {
	xc := getXsuportalContext(e)
	if xc.Team != nil {
		return xc.Team, nil
	}
	contestant, err := getCurrentContestant(e, db, false)
	if err != nil {
		return nil, fmt.Errorf("current contestant: %w", err)
	}
	if contestant == nil {
		return nil, nil
	}
	var team xsuportal.Team
	query := "SELECT * FROM `teams` WHERE `id` = ? LIMIT 1"
	if lock {
		query += " FOR UPDATE"
	}
	err = sqlx.Get(db, &team, query, contestant.TeamID.Int64)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("query team: %w", err)
	}
	xc.Team = &team
	return xc.Team, nil
}

func getCurrentContestStatus(e echo.Context, db sqlx.Queryer) (*xsuportal.ContestStatus, error) {
	var contestStatus xsuportal.ContestStatus
	err := sqlx.Get(db, &contestStatus, "SELECT *, NOW(6) AS `current_time`, CASE WHEN NOW(6) < `registration_open_at` THEN 'standby' WHEN `registration_open_at` <= NOW(6) AND NOW(6) < `contest_starts_at` THEN 'registration' WHEN `contest_starts_at` <= NOW(6) AND NOW(6) < `contest_ends_at` THEN 'started' WHEN `contest_ends_at` <= NOW(6) THEN 'finished' ELSE 'unknown' END AS `status`, IF(`contest_starts_at` <= NOW(6) AND NOW(6) < `contest_freezes_at`, 1, 0) AS `frozen` FROM `contest_config`")
	if err != nil {
		return nil, fmt.Errorf("query contest status: %w", err)
	}
	statusStr := contestStatus.StatusStr
	if e.Echo().Debug {
		b, err := ioutil.ReadFile(DebugContestStatusFilePath)
		if err == nil {
			statusStr = string(b)
		}
	}
	switch statusStr {
	case "standby":
		contestStatus.Status = resources.Contest_STANDBY
	case "registration":
		contestStatus.Status = resources.Contest_REGISTRATION
	case "started":
		contestStatus.Status = resources.Contest_STARTED
	case "finished":
		contestStatus.Status = resources.Contest_FINISHED
	default:
		return nil, fmt.Errorf("unexpected contest status: %q", contestStatus.StatusStr)
	}
	return &contestStatus, nil
}

type loginRequiredOption struct {
	Team bool
	Lock bool
}

func loginRequired(e echo.Context, db sqlx.Queryer, option *loginRequiredOption) (bool, error) {
	contestant, err := getCurrentContestant(e, db, option.Lock)
	if err != nil {
		return false, fmt.Errorf("current contestant: %w", err)
	}
	if contestant == nil {
		return false, halt(e, http.StatusUnauthorized, "ログインが必要です", nil)
	}
	if option.Team {
		t, err := getCurrentTeam(e, db, option.Lock)
		if err != nil {
			return false, fmt.Errorf("current team: %w", err)
		}
		if t == nil {
			return false, halt(e, http.StatusForbidden, "参加登録が必要です", nil)
		}
	}
	return true, nil
}

func contestStatusRestricted(e echo.Context, db sqlx.Queryer, status resources.Contest_Status, message string) (bool, error) {
	contestStatus, err := getCurrentContestStatus(e, db)
	if err != nil {
		return false, fmt.Errorf("get current contest status: %w", err)
	}
	if contestStatus.Status != status {
		return false, halt(e, http.StatusForbidden, message, nil)
	}
	return true, nil
}

func getSession(c echo.Context) (*sessions.Session, error) {
	return session.Get("session_xsucon", c)
}

type XsuportalContext struct {
	Contestant *xsuportal.Contestant
	Team       *xsuportal.Team
}

func getXsuportalContext(e echo.Context) *XsuportalContext {
	xc := e.Get("xsucon_context")
	if xc == nil {
		xc = &XsuportalContext{}
		e.Set("xsucon_context", xc)
	}
	return xc.(*XsuportalContext)
}

type LeaderBoardTeam struct {
	ID                   int64          `db:"id"`
	Name                 string         `db:"name"`
	LeaderID             sql.NullString `db:"leader_id"`
	Withdrawn            bool           `db:"withdrawn"`
	Student              sql.NullBool   `db:"student"`
	BestScore            sql.NullInt64  `db:"best_score"`
	BestScoreStartedAt   sql.NullTime   `db:"best_score_started_at"`
	BestScoreMarkedAt    sql.NullTime   `db:"best_score_marked_at"`
	LatestScore          sql.NullInt64  `db:"latest_score"`
	LatestScoreStartedAt sql.NullTime   `db:"latest_score_started_at"`
	LatestScoreMarkedAt  sql.NullTime   `db:"latest_score_marked_at"`
	FinishCount          sql.NullInt64  `db:"finish_count"`
}

func (t *LeaderBoardTeam) Team() *xsuportal.Team {
	return &xsuportal.Team{
		ID:        t.ID,
		Name:      t.Name,
		LeaderID:  t.LeaderID,
		Withdrawn: t.Withdrawn,
		Student:   t.Student,
	}
}

type ProtoBinder struct{}

func (p ProtoBinder) Bind(i interface{}, e echo.Context) error {
	rc := e.Request().Body
	defer rc.Close()
	b, err := ioutil.ReadAll(rc)
	if err != nil {
		return halt(e, http.StatusBadRequest, "", fmt.Errorf("read request body: %w", err))
	}
	if err := proto.Unmarshal(b, i.(proto.Message)); err != nil {
		return halt(e, http.StatusBadRequest, "", fmt.Errorf("unmarshal request body: %w", err))
	}
	return nil
}

func writeProto(e echo.Context, code int, m proto.Message) error {
	res, _ := proto.Marshal(m)
	return e.Blob(code, "application/vnd.google.protobuf", res)
}

func halt(e echo.Context, code int, humanMessage string, err error) error {
	message := &xsuportalpb.Error{
		Code: int32(code),
	}
	if err != nil {
		message.Name = fmt.Sprintf("%T", err)
		message.HumanMessage = err.Error()
		message.HumanDescriptions = strings.Split(fmt.Sprintf("%+v", err), "\n")
	}
	if humanMessage != "" {
		message.HumanMessage = humanMessage
		message.HumanDescriptions = []string{humanMessage}
	}
	res, _ := proto.Marshal(message)
	return e.Blob(code, "application/vnd.google.protobuf; proto=xsuportal.proto.Error", res)
}

func makeClarificationPB(db sqlx.Queryer, c *xsuportal.Clarification, t *xsuportal.Team) (*resources.Clarification, error) {
	team, err := makeTeamPB(db, t, false, true)
	if err != nil {
		return nil, fmt.Errorf("make team: %w", err)
	}
	pb := &resources.Clarification{
		Id:        c.ID,
		TeamId:    c.TeamID,
		Answered:  c.AnsweredAt.Valid,
		Disclosed: c.Disclosed.Bool,
		Question:  c.Question.String,
		Answer:    c.Answer.String,
		CreatedAt: timestamppb.New(c.CreatedAt),
		Team:      team,
	}
	if c.AnsweredAt.Valid {
		pb.AnsweredAt = timestamppb.New(c.AnsweredAt.Time)
	}
	return pb, nil
}

func makeTeamPB(db sqlx.Queryer, t *xsuportal.Team, detail bool, enableMembers bool) (*resources.Team, error) {
	pb := &resources.Team{
		Id:        t.ID,
		Name:      t.Name,
		LeaderId:  t.LeaderID.String,
		Withdrawn: t.Withdrawn,
	}
	if detail {
		pb.Detail = &resources.Team_TeamDetail{
			EmailAddress: t.EmailAddress,
			InviteToken:  t.InviteToken,
		}
	}
	if enableMembers {
		if t.LeaderID.Valid {
			var leader xsuportal.Contestant
			if err := sqlx.Get(db, &leader, "SELECT * FROM `contestants` WHERE `id` = ? LIMIT 1", t.LeaderID.String); err != nil {
				return nil, fmt.Errorf("get leader: %w", err)
			}
			pb.Leader = makeContestantPB(&leader)
		}
		var members []xsuportal.Contestant
		if err := sqlx.Select(db, &members, "SELECT * FROM `contestants` WHERE `team_id` = ? ORDER BY `created_at`", t.ID); err != nil {
			return nil, fmt.Errorf("select members: %w", err)
		}
		for _, member := range members {
			pb.Members = append(pb.Members, makeContestantPB(&member))
			pb.MemberIds = append(pb.MemberIds, member.ID)
		}
	}
	if t.Student.Valid {
		pb.Student = &resources.Team_StudentStatus{
			Status: t.Student.Bool,
		}
	}
	return pb, nil
}

func makeContestantPB(c *xsuportal.Contestant) *resources.Contestant {
	return &resources.Contestant{
		Id:        c.ID,
		TeamId:    c.TeamID.Int64,
		Name:      c.Name.String,
		IsStudent: c.Student,
		IsStaff:   c.Staff,
	}
}

func makeContestPB(e echo.Context) (*resources.Contest, error) {
	contestStatus, err := getCurrentContestStatus(e, db)
	if err != nil {
		return nil, fmt.Errorf("get current contest status: %w", err)
	}
	return &resources.Contest{
		RegistrationOpenAt: timestamppb.New(contestStatus.RegistrationOpenAt),
		ContestStartsAt:    timestamppb.New(contestStatus.ContestStartsAt),
		ContestFreezesAt:   timestamppb.New(contestStatus.ContestFreezesAt),
		ContestEndsAt:      timestamppb.New(contestStatus.ContestEndsAt),
		Status:             contestStatus.Status,
		Frozen:             contestStatus.Frozen,
	}, nil
}

func makeLeaderboardPB(e echo.Context, teamID int64) (*resources.Leaderboard, error) {
	contestStatus, err := getCurrentContestStatus(e, db)
	if err != nil {
		return nil, fmt.Errorf("get current contest status: %w", err)
	}
	contestFinished := contestStatus.Status == resources.Contest_FINISHED
	contestFreezesAt := contestStatus.ContestFreezesAt

	tx, err := db.Beginx()
	if err != nil {
		return nil, fmt.Errorf("begin tx: %w", err)
	}
	defer tx.Rollback()
	var leaderboard []LeaderBoardTeam
	query := "SELECT\n" +
		"  `teams`.`id` AS `id`,\n" +
		"  `teams`.`name` AS `name`,\n" +
		"  `teams`.`leader_id` AS `leader_id`,\n" +
		"  `teams`.`withdrawn` AS `withdrawn`,\n" +
		"  `team_student_flags`.`student` AS `student`,\n" +
		"  (`best_score_jobs`.`score_raw` - `best_score_jobs`.`score_deduction`) AS `best_score`,\n" +
		"  `best_score_jobs`.`started_at` AS `best_score_started_at`,\n" +
		"  `best_score_jobs`.`finished_at` AS `best_score_marked_at`,\n" +
		"  (`latest_score_jobs`.`score_raw` - `latest_score_jobs`.`score_deduction`) AS `latest_score`,\n" +
		"  `latest_score_jobs`.`started_at` AS `latest_score_started_at`,\n" +
		"  `latest_score_jobs`.`finished_at` AS `latest_score_marked_at`,\n" +
		"  `latest_score_job_ids`.`finish_count` AS `finish_count`\n" +
		"FROM\n" +
		"  `teams`\n" +
		"  -- latest scores\n" +
		"  LEFT JOIN (\n" +
		"    SELECT\n" +
		"      MAX(`id`) AS `id`,\n" +
		"      `team_id`,\n" +
		"      COUNT(*) AS `finish_count`\n" +
		"    FROM\n" +
		"      `benchmark_jobs`\n" +
		"    WHERE\n" +
		"      `finished_at` IS NOT NULL\n" +
		"      -- score freeze\n" +
		"      AND (`team_id` = ? OR (`team_id` != ? AND (? = TRUE OR `finished_at` < ?)))\n" +
		"    GROUP BY\n" +
		"      `team_id`\n" +
		"  ) `latest_score_job_ids` ON `latest_score_job_ids`.`team_id` = `teams`.`id`\n" +
		"  LEFT JOIN `benchmark_jobs` `latest_score_jobs` ON `latest_score_job_ids`.`id` = `latest_score_jobs`.`id`\n" +
		"  -- best scores\n" +
		"  LEFT JOIN (\n" +
		"    SELECT\n" +
		"      MAX(`j`.`id`) AS `id`,\n" +
		"      `j`.`team_id` AS `team_id`\n" +
		"    FROM\n" +
		"      (\n" +
		"        SELECT\n" +
		"          `team_id`,\n" +
		"          MAX(`score_raw` - `score_deduction`) AS `score`\n" +
		"        FROM\n" +
		"          `benchmark_jobs`\n" +
		"        WHERE\n" +
		"          `finished_at` IS NOT NULL\n" +
		"          -- score freeze\n" +
		"          AND (`team_id` = ? OR (`team_id` != ? AND (? = TRUE OR `finished_at` < ?)))\n" +
		"        GROUP BY\n" +
		"          `team_id`\n" +
		"      ) `best_scores`\n" +
		"      LEFT JOIN `benchmark_jobs` `j` ON (`j`.`score_raw` - `j`.`score_deduction`) = `best_scores`.`score`\n" +
		"        AND `j`.`team_id` = `best_scores`.`team_id`\n" +
		"    GROUP BY\n" +
		"      `j`.`team_id`\n" +
		"  ) `best_score_job_ids` ON `best_score_job_ids`.`team_id` = `teams`.`id`\n" +
		"  LEFT JOIN `benchmark_jobs` `best_score_jobs` ON `best_score_jobs`.`id` = `best_score_job_ids`.`id`\n" +
		"  -- check student teams\n" +
		"  LEFT JOIN (\n" +
		"    SELECT\n" +
		"      `team_id`,\n" +
		"      (SUM(`student`) = COUNT(*)) AS `student`\n" +
		"    FROM\n" +
		"      `contestants`\n" +
		"    GROUP BY\n" +
		"      `contestants`.`team_id`\n" +
		"  ) `team_student_flags` ON `team_student_flags`.`team_id` = `teams`.`id`\n" +
		"ORDER BY\n" +
		"  `latest_score` DESC,\n" +
		"  `latest_score_marked_at` ASC\n"
	err = tx.Select(&leaderboard, query, teamID, teamID, contestFinished, contestFreezesAt, teamID, teamID, contestFinished, contestFreezesAt)
	if err != sql.ErrNoRows && err != nil {
		return nil, fmt.Errorf("select leaderboard: %w", err)
	}
	jobResultsQuery := "SELECT\n" +
		"  `team_id` AS `team_id`,\n" +
		"  (`score_raw` - `score_deduction`) AS `score`,\n" +
		"  `started_at` AS `started_at`,\n" +
		"  `finished_at` AS `finished_at`\n" +
		"FROM\n" +
		"  `benchmark_jobs`\n" +
		"WHERE\n" +
		"  `started_at` IS NOT NULL\n" +
		"  AND (\n" +
		"    `finished_at` IS NOT NULL\n" +
		"    -- score freeze\n" +
		"    AND (`team_id` = ? OR (`team_id` != ? AND (? = TRUE OR `finished_at` < ?)))\n" +
		"  )\n" +
		"ORDER BY\n" +
		"  `finished_at`"
	var jobResults []xsuportal.JobResult
	err = tx.Select(&jobResults, jobResultsQuery, teamID, teamID, contestFinished, contestFreezesAt)
	if err != sql.ErrNoRows && err != nil {
		return nil, fmt.Errorf("select job results: %w", err)
	}
	if err := tx.Commit(); err != nil {
		return nil, fmt.Errorf("commit tx: %w", err)
	}
	teamGraphScores := make(map[int64][]*resources.Leaderboard_LeaderboardItem_LeaderboardScore)
	for _, jobResult := range jobResults {
		teamGraphScores[jobResult.TeamID] = append(teamGraphScores[jobResult.TeamID], &resources.Leaderboard_LeaderboardItem_LeaderboardScore{
			Score:     jobResult.Score,
			StartedAt: timestamppb.New(jobResult.StartedAt),
			MarkedAt:  timestamppb.New(jobResult.FinishedAt),
		})
	}
	pb := &resources.Leaderboard{}
	for _, team := range leaderboard {
		t, _ := makeTeamPB(db, team.Team(), false, false)
		item := &resources.Leaderboard_LeaderboardItem{
			Scores: teamGraphScores[team.ID],
			BestScore: &resources.Leaderboard_LeaderboardItem_LeaderboardScore{
				Score:     team.BestScore.Int64,
				StartedAt: toTimestamp(team.BestScoreStartedAt),
				MarkedAt:  toTimestamp(team.BestScoreMarkedAt),
			},
			LatestScore: &resources.Leaderboard_LeaderboardItem_LeaderboardScore{
				Score:     team.LatestScore.Int64,
				StartedAt: toTimestamp(team.LatestScoreStartedAt),
				MarkedAt:  toTimestamp(team.LatestScoreMarkedAt),
			},
			Team:        t,
			FinishCount: team.FinishCount.Int64,
		}
		if team.Student.Valid && team.Student.Bool {
			pb.StudentTeams = append(pb.StudentTeams, item)
		} else {
			pb.GeneralTeams = append(pb.GeneralTeams, item)
		}
		pb.Teams = append(pb.Teams, item)
	}
	return pb, nil
}

func makeBenchmarkJobPB(job *xsuportal.BenchmarkJob) *resources.BenchmarkJob {
	pb := &resources.BenchmarkJob{
		Id:             job.ID,
		TeamId:         job.TeamID,
		Status:         resources.BenchmarkJob_Status(job.Status),
		TargetHostname: job.TargetHostName,
		CreatedAt:      timestamppb.New(job.CreatedAt),
		UpdatedAt:      timestamppb.New(job.UpdatedAt),
	}
	if job.StartedAt.Valid {
		pb.StartedAt = timestamppb.New(job.StartedAt.Time)
	}
	if job.FinishedAt.Valid {
		pb.FinishedAt = timestamppb.New(job.FinishedAt.Time)
		pb.Result = makeBenchmarkResultPB(job)
	}
	return pb
}

func makeBenchmarkResultPB(job *xsuportal.BenchmarkJob) *resources.BenchmarkResult {
	hasScore := job.ScoreRaw.Valid && job.ScoreDeduction.Valid
	pb := &resources.BenchmarkResult{
		Finished: job.FinishedAt.Valid,
		Passed:   job.Passed.Bool,
		Reason:   job.Reason.String,
	}
	if hasScore {
		pb.Score = int64(job.ScoreRaw.Int32 - job.ScoreDeduction.Int32)
		pb.ScoreBreakdown = &resources.BenchmarkResult_ScoreBreakdown{
			Raw:       int64(job.ScoreRaw.Int32),
			Deduction: int64(job.ScoreDeduction.Int32),
		}
	}
	return pb
}

func makeBenchmarkJobsPB(e echo.Context, db sqlx.Queryer, limit int) ([]*resources.BenchmarkJob, error) {
	team, _ := getCurrentTeam(e, db, false)
	query := "SELECT * FROM `benchmark_jobs` WHERE `team_id` = ? ORDER BY `created_at` DESC"
	if limit > 0 {
		query += fmt.Sprintf(" LIMIT %d", limit)
	}
	var jobs []xsuportal.BenchmarkJob
	if err := sqlx.Select(db, &jobs, query, team.ID); err != nil {
		return nil, fmt.Errorf("select benchmark jobs: %w", err)
	}
	var benchmarkJobs []*resources.BenchmarkJob
	for _, job := range jobs {
		benchmarkJobs = append(benchmarkJobs, makeBenchmarkJobPB(&job))
	}
	return benchmarkJobs, nil
}

func makeNotificationsPB(notifications []*xsuportal.Notification) ([]*resources.Notification, error) {
	var ns []*resources.Notification
	for _, notification := range notifications {
		decoded, err := base64.StdEncoding.DecodeString(notification.EncodedMessage)
		if err != nil {
			return nil, fmt.Errorf("decode message: %w", err)
		}
		var message resources.Notification
		if err := proto.Unmarshal(decoded, &message); err != nil {
			return nil, fmt.Errorf("unmarshal message: %w", err)
		}
		message.Id = notification.ID
		message.CreatedAt = timestamppb.New(notification.CreatedAt)
		ns = append(ns, &message)
	}
	return ns, nil
}

func wrapError(message string, err error) error {
	if err == nil {
		return nil
	}
	return fmt.Errorf("%s: %w", message, err)
}

func toTimestamp(t sql.NullTime) *timestamppb.Timestamp {
	if t.Valid {
		return timestamppb.New(t.Time)
	}
	return nil
}
