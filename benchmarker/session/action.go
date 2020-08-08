package session

import (
	"context"
	"fmt"
	"github.com/isucon/isucon10-final/benchmarker/model"
	"github.com/isucon/isucon10-final/proto/xsuportal"
	"github.com/isucon/isucon10-final/proto/xsuportal/resources"
	"github.com/isucon/isucon10-final/proto/xsuportal/services/admin"
	"github.com/isucon/isucon10-final/proto/xsuportal/services/audience"
	"github.com/isucon/isucon10-final/proto/xsuportal/services/common"
	"github.com/isucon/isucon10-final/proto/xsuportal/services/contestant"
	"github.com/isucon/isucon10-final/proto/xsuportal/services/registration"
	"net/http"
)

func (s *Session) InitializeAction(ctx context.Context) (*admin.InitializeResponse, *xsuportal.Error, error) {
	req := &admin.InitializeRequest{}
	res := &admin.InitializeResponse{}

	xerr, err := s.Call(ctx, http.MethodPost, "/initialize", req, res)
	return res, xerr, err
}

func (s *Session) SignupAction(ctx context.Context) (*contestant.SignupResponse, *xsuportal.Error, error) {
	req := &contestant.SignupRequest{
		ContestantId: s.Contestant.ID,
		Password:     s.Contestant.Password,
	}
	res := &contestant.SignupResponse{}

	xerr, err := s.Call(ctx, http.MethodPost, "/api/signup", req, res)
	return res, xerr, err
}

func (s *Session) LoginAction(ctx context.Context) (*contestant.LoginResponse, *xsuportal.Error, error) {
	req := &contestant.LoginRequest{
		ContestantId: s.Contestant.ID,
		Password:     s.Contestant.Password,
	}
	res := &contestant.LoginResponse{}

	xerr, err := s.Call(ctx, http.MethodPost, "/api/login", req, res)
	return res, xerr, err
}

func (s *Session) LogoutAction(ctx context.Context) (*contestant.LogoutResponse, *xsuportal.Error, error) {
	req := &contestant.LogoutRequest{}
	res := &contestant.LogoutResponse{}

	xerr, err := s.Call(ctx, http.MethodPost, "/api/logout", req, res)
	return res, xerr, err
}

func (s *Session) UpdateContest(ctx context.Context, contest *model.Contest) (*admin.UpdateContestResponse, *xsuportal.Error, error) {
	req := &admin.UpdateContestRequest{
		Contest: &resources.Contest{
			RegistrationOpenAt: time2Timestamp(contest.RegistrationOpenAt),
			ContestStartsAt:    time2Timestamp(contest.ContestStartsAt),
			ContestFreezesAt:   time2Timestamp(contest.ContestFreezesAt),
			ContestEndsAt:      time2Timestamp(contest.ContestEndsAt),
		},
	}
	res := &admin.UpdateContestResponse{}

	xerr, err := s.Call(ctx, http.MethodPut, "/api/admin/contest", req, res)
	return res, xerr, err
}

func (s *Session) GetContest(ctx context.Context) (*common.GetContestResponse, *xsuportal.Error, error) {
	res := &common.GetContestResponse{}

	xerr, err := s.Call(ctx, http.MethodGet, "/api/contest", nil, res)
	return res, xerr, err
}

func (s *Session) GetCurrentSession(ctx context.Context) (*common.GetCurrentSessionResponse, *xsuportal.Error, error) {
	res := &common.GetCurrentSessionResponse{}

	xerr, err := s.Call(ctx, http.MethodGet, "/api/session", nil, res)
	return res, xerr, err
}

func (s *Session) ListTeams(ctx context.Context) (*audience.ListTeamsResponse, *xsuportal.Error, error) {
	res := &audience.ListTeamsResponse{}

	xerr, err := s.Call(ctx, http.MethodGet, "/api/audience/teams", nil, res)
	return res, xerr, err
}

func (s *Session) GetRegistrationSession(ctx context.Context) (*registration.GetRegistrationSessionResponse, *xsuportal.Error, error) {
	res := &registration.GetRegistrationSessionResponse{}

	xerr, err := s.Call(ctx, http.MethodGet, "/api/registration/session", nil, res)
	return res, xerr, err
}

func (s *Session) CreateTeam(ctx context.Context, team *model.Team) (*registration.CreateTeamResponse, *xsuportal.Error, error) {
	req := &registration.CreateTeamRequest{
		TeamName:     team.TeamName,
		EmailAddress: team.EmailAddress,
		Name:         s.Contestant.Name,
		IsStudent:    s.Contestant.IsStudent,
	}
	res := &registration.CreateTeamResponse{}

	xerr, err := s.Call(ctx, http.MethodPost, "/api/registration/team", req, res)

	if res != nil && xerr == nil && err == nil {
		team.ID = res.GetTeamId()
	}
	return res, xerr, err
}

func (s *Session) JoinTeam(ctx context.Context, team *model.Team, inviteToken string) (*registration.JoinTeamResponse, *xsuportal.Error, error) {
	req := &registration.JoinTeamRequest{
		TeamId:      team.ID,
		InviteToken: inviteToken,
		Name:        s.Contestant.Name,
		IsStudent:   s.Contestant.IsStudent,
	}
	res := &registration.JoinTeamResponse{}

	xerr, err := s.Call(ctx, http.MethodPost, "/api/registration/contestant", req, res)
	return res, xerr, err
}

func (s *Session) UpdateRegistration(ctx context.Context, team *model.Team) (*registration.UpdateRegistrationResponse, *xsuportal.Error, error) {
	req := &registration.UpdateRegistrationRequest{
		TeamName:     team.TeamName,
		EmailAddress: team.EmailAddress,
		Name:         s.Contestant.Name,
		IsStudent:    s.Contestant.IsStudent,
	}
	res := &registration.UpdateRegistrationResponse{}

	xerr, err := s.Call(ctx, http.MethodPut, "/api/registration", req, res)
	return res, xerr, err
}

func (s *Session) DeleteRegistration(ctx context.Context, team *model.Team, inviteToken string) (*registration.DeleteRegistrationResponse, *xsuportal.Error, error) {
	req := &registration.DeleteRegistrationRequest{}
	res := &registration.DeleteRegistrationResponse{}

	xerr, err := s.Call(ctx, http.MethodDelete, "/api/registration", req, res)
	return res, xerr, err
}

func (s *Session) EnqueueBenchmarkJob(ctx context.Context, team *model.Team) (*contestant.EnqueueBenchmarkJobResponse, *xsuportal.Error, error) {
	req := &contestant.EnqueueBenchmarkJobRequest{
		TargetHostname: team.TargetHost(),
	}
	res := &contestant.EnqueueBenchmarkJobResponse{}

	xerr, err := s.Call(ctx, http.MethodPost, "/api/contestant/benchmark_jobs", req, res)
	return res, xerr, err
}

func (s *Session) ListBenchmarkJobs(ctx context.Context) (*contestant.ListBenchmarkJobsResponse, *xsuportal.Error, error) {
	res := &contestant.ListBenchmarkJobsResponse{}

	xerr, err := s.Call(ctx, http.MethodGet, "/api/contestant/benchmark_jobs", nil, res)
	return res, xerr, err
}

func (s *Session) GetBenchmarkJob(ctx context.Context, id int64) (*contestant.GetBenchmarkJobResponse, *xsuportal.Error, error) {
	res := &contestant.GetBenchmarkJobResponse{}

	xerr, err := s.Call(ctx, http.MethodGet, fmt.Sprintf("/api/contestant/benchmark_jobs/%d", id), nil, res)
	return res, xerr, err
}

func (s *Session) Dashboard(ctx context.Context) (*contestant.DashboardResponse, *xsuportal.Error, error) {
	res := &contestant.DashboardResponse{}

	xerr, err := s.Call(ctx, http.MethodGet, "/api/contestant/dashboard", nil, res)
	return res, xerr, err
}
