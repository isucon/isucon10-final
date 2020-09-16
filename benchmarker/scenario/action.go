package scenario

import (
	"context"
	"fmt"
	"net/http"

	"github.com/golang/protobuf/ptypes"
	"github.com/isucon/isucon10-final/benchmarker/model"
	"github.com/isucon/isucon10-final/benchmarker/proto/xsuportal/resources"
	"github.com/isucon/isucon10-final/benchmarker/proto/xsuportal/services/admin"
	"github.com/isucon/isucon10-final/benchmarker/proto/xsuportal/services/audience"
	"github.com/isucon/isucon10-final/benchmarker/proto/xsuportal/services/common"
	"github.com/isucon/isucon10-final/benchmarker/proto/xsuportal/services/contestant"
	"github.com/isucon/isucon10-final/benchmarker/proto/xsuportal/services/registration"
	"github.com/rosylilly/isucandar/agent"
)

func BrowserAccess(ctx context.Context, member *model.Contestant, rpath string) (*http.Response, agent.Resources, error) {
	req, err := member.Agent.GET(rpath)
	if err != nil {
		return nil, nil, err
	}

	res, err := member.Agent.Do(ctx, req)
	if err != nil {
		return nil, nil, err
	}

	resources, err := member.Agent.ProcessHTML(ctx, res, res.Body)
	if err != nil {
		return res, resources, err
	}

	_, err = GetCurrentSession(ctx, member)

	return res, resources, err
}

func BrowserAccessGuest(ctx context.Context, agent *agent.Agent, rpath string) (*http.Response, agent.Resources, error) {
	req, err := agent.GET(rpath)
	if err != nil {
		return nil, nil, err
	}

	res, err := agent.Do(ctx, req)
	if err != nil {
		return nil, nil, err
	}

	resources, err := agent.ProcessHTML(ctx, res, res.Body)
	if err != nil {
		return res, resources, err
	}

	return res, resources, err
}

func InitializeAction(ctx context.Context, a *agent.Agent, contest *model.Contest) (*admin.InitializeResponse, *http.Response, error) {
	roa, err := ptypes.TimestampProto(contest.RegistrationOpenAt)
	if err != nil {
		return nil, nil, err
	}
	csa, err := ptypes.TimestampProto(contest.ContestStartsAt)
	if err != nil {
		return nil, nil, err
	}
	cfa, err := ptypes.TimestampProto(contest.ContestFreezesAt)
	if err != nil {
		return nil, nil, err
	}
	cea, err := ptypes.TimestampProto(contest.ContestEndsAt)
	if err != nil {
		return nil, nil, err
	}

	req := &admin.InitializeRequest{
		Contest: &resources.Contest{
			RegistrationOpenAt: roa,
			ContestStartsAt:    csa,
			ContestFreezesAt:   cfa,
			ContestEndsAt:      cea,
		},
	}
	res := &admin.InitializeResponse{}

	hres, err := ProtobufRequest(ctx, a, http.MethodPost, "/initialize", req, res)
	return res, hres, err
}

func GetCurrentSession(ctx context.Context, member *model.Contestant) (*common.GetCurrentSessionResponse, error) {
	res := &common.GetCurrentSessionResponse{}

	_, err := ProtobufRequest(ctx, member.Agent, http.MethodGet, "/api/session", nil, res)
	return res, err
}

func SignupAction(ctx context.Context, c *model.Contestant) (*contestant.SignupResponse, error) {
	req := &contestant.SignupRequest{
		ContestantId: c.ID,
		Password:     c.Password,
	}
	res := &contestant.SignupResponse{}

	_, err := ProtobufRequest(ctx, c.Agent, http.MethodPost, "/api/signup", req, res)
	return res, err
}

func LoginAction(ctx context.Context, c *model.Contestant) (*contestant.LoginResponse, error) {
	req := &contestant.LoginRequest{
		ContestantId: c.ID,
		Password:     c.Password,
	}
	res := &contestant.LoginResponse{}

	_, err := ProtobufRequest(ctx, c.Agent, http.MethodPost, "/api/login", req, res)
	return res, err
}

func CreateTeamAction(ctx context.Context, team *model.Team, c *model.Contestant) (*registration.CreateTeamResponse, error) {
	req := &registration.CreateTeamRequest{
		TeamName:     team.TeamName,
		EmailAddress: team.EmailAddress,
		Name:         c.Name,
		IsStudent:    c.IsStudent,
	}
	res := &registration.CreateTeamResponse{}

	_, err := ProtobufRequest(ctx, c.Agent, http.MethodPost, "/api/registration/team", req, res)

	return res, err
}

func GetRegistrationSession(ctx context.Context, c *model.Contestant) (*registration.GetRegistrationSessionResponse, error) {
	res := &registration.GetRegistrationSessionResponse{}

	_, err := ProtobufRequest(ctx, c.Agent, http.MethodGet, "/api/registration/session", nil, res)
	return res, err
}

func JoinTeamAction(ctx context.Context, team *model.Team, c *model.Contestant, inviteToken string) (*registration.JoinTeamResponse, error) {
	req := &registration.JoinTeamRequest{
		TeamId:      team.ID,
		InviteToken: inviteToken,
		Name:        c.Name,
		IsStudent:   c.IsStudent,
	}
	res := &registration.JoinTeamResponse{}

	_, err := ProtobufRequest(ctx, c.Agent, http.MethodPost, "/api/registration/contestant", req, res)
	return res, err
}

func EnqueueBenchmarkJobAction(ctx context.Context, team *model.Team) (*contestant.EnqueueBenchmarkJobResponse, error) {
	req := &contestant.EnqueueBenchmarkJobRequest{
		TargetHostname: team.TargetHost(),
	}
	res := &contestant.EnqueueBenchmarkJobResponse{}

	_, err := ProtobufRequest(ctx, team.Developer.Agent, http.MethodPost, "/api/contestant/benchmark_jobs", req, res)

	return res, err
}

func GetDashboardAction(ctx context.Context, team *model.Team, member *model.Contestant) (*contestant.DashboardResponse, error) {
	req := &contestant.DashboardRequest{}
	res := &contestant.DashboardResponse{}

	_, err := ProtobufRequest(ctx, member.Agent, http.MethodGet, "/api/contestant/dashboard", req, res)
	return res, err
}

func GetBenchmarkJobs(ctx context.Context, team *model.Team, member *model.Contestant) (*contestant.ListBenchmarkJobsResponse, error) {
	req := &contestant.ListBenchmarkJobsRequest{}
	res := &contestant.ListBenchmarkJobsResponse{}

	_, err := ProtobufRequest(ctx, member.Agent, http.MethodGet, "/api/contestant/benchmark_jobs", req, res)
	return res, err
}

func GetBenchmarkJobAction(ctx context.Context, id int64, member *model.Contestant) (*contestant.GetBenchmarkJobResponse, error) {
	res := &contestant.GetBenchmarkJobResponse{}

	_, err := ProtobufRequest(ctx, member.Agent, http.MethodGet, fmt.Sprintf("/api/contestant/benchmark_jobs/%d", id), nil, res)
	return res, err
}

func GetClarificationsAction(ctx context.Context, member *model.Contestant) (*contestant.ListClarificationsResponse, error) {
	res := &contestant.ListClarificationsResponse{}

	_, err := ProtobufRequest(ctx, member.Agent, http.MethodGet, "/api/contestant/clarifications", nil, res)
	return res, err
}

func PostClarificationAction(ctx context.Context, member *model.Contestant, question string) (*contestant.RequestClarificationResponse, error) {
	req := &contestant.RequestClarificationRequest{
		Question: question,
	}
	res := &contestant.RequestClarificationResponse{}

	_, err := ProtobufRequest(ctx, member.Agent, http.MethodPost, "/api/contestant/clarifications", req, res)
	return res, err
}

func AdminGetClarificationsAction(ctx context.Context, member *model.Contestant) (*admin.ListClarificationsResponse, error) {
	req := &admin.ListClarificationsRequest{}
	res := &admin.ListClarificationsResponse{}

	_, err := ProtobufRequest(ctx, member.Agent, http.MethodGet, "/api/admin/clarifications", req, res)
	return res, err
}

func AdminGetClarificationAction(ctx context.Context, id int64, member *model.Contestant) (*admin.GetClarificationResponse, error) {
	req := &admin.GetClarificationRequest{}
	res := &admin.GetClarificationResponse{}

	_, err := ProtobufRequest(ctx, member.Agent, http.MethodGet, fmt.Sprintf("/api/admin/clarifications/%d", id), req, res)
	return res, err
}

func AdminPostClarificationAction(ctx context.Context, id int64, member *model.Contestant, answer string) (*admin.RespondClarificationResponse, error) {
	req := &admin.RespondClarificationRequest{
		Id:       id,
		Disclose: false,
		Answer:   answer,
	}
	res := &admin.RespondClarificationResponse{}

	_, err := ProtobufRequest(ctx, member.Agent, http.MethodPut, fmt.Sprintf("/api/admin/clarifications/%d", id), req, res)
	return res, err
}

func AudienceGetDashboardAction(ctx context.Context, agent *agent.Agent) (*audience.DashboardResponse, error) {
	req := &audience.DashboardRequest{}
	res := &audience.DashboardResponse{}

	_, err := ProtobufRequest(ctx, agent, http.MethodGet, "/api/audience/dashboard", req, res)
	return res, err
}
