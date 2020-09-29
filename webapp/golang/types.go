package xsuportal

import (
	"database/sql"
	"time"

	"github.com/isucon/isucon10-final/webapp/golang/proto/xsuportal/resources"
)

type Contestant struct {
	ID        string         `db:"id"`
	Password  string         `db:"password"`
	TeamID    sql.NullInt64  `db:"team_id"`
	Name      sql.NullString `db:"name"`
	Student   bool           `db:"student"`
	Staff     bool           `db:"staff"`
	CreatedAt time.Time      `db:"created_at"`
}

type Team struct {
	ID           int64          `db:"id"`
	Name         string         `db:"name"`
	LeaderID     sql.NullString `db:"leader_id"`
	EmailAddress string         `db:"email_address"`
	InviteToken  string         `db:"invite_token"`
	Withdrawn    bool           `db:"withdrawn"`
	CreatedAt    time.Time      `db:"created_at"`
	Student      sql.NullBool   `db:"-"`
}

type JobResult struct {
	TeamID     int64     `db:"team_id"`
	Score      int64     `db:"score"`
	StartedAt  time.Time `db:"started_at"`
	FinishedAt time.Time `db:"finished_at"`
}

type Clarification struct {
	ID         int64          `db:"id"`
	TeamID     int64          `db:"team_id"`
	Disclosed  sql.NullBool   `db:"disclosed"`
	Question   sql.NullString `db:"question"`
	Answer     sql.NullString `db:"answer"`
	AnsweredAt sql.NullTime   `db:"answered_at"`
	CreatedAt  time.Time      `db:"created_at"`
	UpdatedAt  time.Time      `db:"updated_at"`
}

type ContestStatus struct {
	RegistrationOpenAt time.Time `db:"registration_open_at"`
	ContestStartsAt    time.Time `db:"contest_starts_at"`
	ContestFreezesAt   time.Time `db:"contest_freezes_at"`
	ContestEndsAt      time.Time `db:"contest_ends_at"`
	CurrentTime        time.Time `db:"current_time"`
	StatusStr          string    `db:"status"`
	Frozen             bool      `db:"frozen"`

	Status resources.Contest_Status `db:"-"`
}

type BenchmarkJob struct {
	ID             int64          `db:"id"`
	TeamID         int64          `db:"team_id"`
	Status         int            `db:"status"`
	TargetHostName string         `db:"target_hostname"`
	Handle         sql.NullString `db:"handle"`
	ScoreRaw       sql.NullInt32  `db:"score_raw"`
	ScoreDeduction sql.NullInt32  `db:"score_deduction"`
	Reason         sql.NullString `db:"reason"`
	Passed         sql.NullBool   `db:"passed"`
	StartedAt      sql.NullTime   `db:"started_at"`
	FinishedAt     sql.NullTime   `db:"finished_at"`
	CreatedAt      time.Time      `db:"created_at"`
	UpdatedAt      time.Time      `db:"updated_at"`
}

type Notification struct {
	ID             int64     `db:"id"`
	ContestantID   string    `db:"contestant_id"`
	Read           bool      `db:"read"`
	EncodedMessage string    `db:"encoded_message"`
	CreatedAt      time.Time `db:"created_at"`
	UpdatedAt      time.Time `db:"updated_at"`
}

type PushSubscription struct {
	ID           int64     `db:"id"`
	ContestantID string    `db:"contestant_id"`
	Endpoint     string    `db:"endpoint"`
	P256DH       string    `db:"p256dh"`
	Auth         string    `db:"auth"`
	CreatedAt    time.Time `db:"created_at"`
	UpdatedAt    time.Time `db:"updated_at"`
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

func (t *LeaderBoardTeam) Team() *Team {
	return &Team{
		ID:        t.ID,
		Name:      t.Name,
		LeaderID:  t.LeaderID,
		Withdrawn: t.Withdrawn,
		Student:   t.Student,
	}
}
