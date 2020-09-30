package scenario

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/golang/protobuf/ptypes"
	"github.com/isucon/isucandar/agent"
	"github.com/isucon/isucandar/failure"
	"github.com/isucon/isucon10-final/benchmarker/model"
	"github.com/isucon/isucon10-final/benchmarker/proto/xsuportal/resources"
	"github.com/isucon/isucon10-final/benchmarker/proto/xsuportal/services/admin"
	"github.com/isucon/isucon10-final/benchmarker/proto/xsuportal/services/audience"
	"github.com/isucon/isucon10-final/benchmarker/proto/xsuportal/services/common"
	"github.com/isucon/isucon10-final/benchmarker/proto/xsuportal/services/contestant"
	"github.com/isucon/isucon10-final/benchmarker/proto/xsuportal/services/registration"
	"github.com/isucon/isucon10-final/benchmarker/pushserver"
)

func BrowserAccess(ctx context.Context, member *model.Contestant, rpath string) (*http.Response, agent.Resources, *common.GetCurrentSessionResponse, error) {
	req, err := member.Agent.GET(rpath)
	if err != nil {
		return nil, nil, nil, failure.NewError(ErrHTTP, err)
	}

	res, err := member.Agent.Do(ctx, req)
	if err != nil {
		return nil, nil, nil, failure.NewError(ErrHTTP, err)
	}

	if ctx.Err() != nil {
		return res, nil, nil, nil
	}

	resources, err := member.Agent.ProcessHTML(ctx, res, res.Body)
	if err != nil {
		return res, resources, nil, failure.NewError(ErrHTTP, err)
	}

	session, err := GetCurrentSession(ctx, member)
	return res, resources, session, err
}

func BrowserAccessGuest(ctx context.Context, agent *agent.Agent, rpath string) (*http.Response, agent.Resources, error) {
	req, err := agent.GET(rpath)
	if err != nil {
		return nil, nil, failure.NewError(ErrHTTP, err)
	}

	res, err := agent.Do(ctx, req)
	if err != nil {
		return nil, nil, failure.NewError(ErrHTTP, err)
	}

	resources, err := agent.ProcessHTML(ctx, res, res.Body)
	if err != nil {
		return res, resources, failure.NewError(ErrHTTP, err)
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

	hres, err := ProtobufRequest(ctx, a, http.MethodPost, "/initialize", req, res, []int{200})
	return res, hres, err
}

func GetCurrentSession(ctx context.Context, member *model.Contestant) (*common.GetCurrentSessionResponse, error) {
	res := &common.GetCurrentSessionResponse{}

	_, err := ProtobufRequest(ctx, member.Agent, http.MethodGet, "/api/session", nil, res, []int{200})
	return res, err
}

func SignupAction(ctx context.Context, c *model.Contestant) (*contestant.SignupResponse, *http.Response, error) {
	req := &contestant.SignupRequest{
		ContestantId: c.ID,
		Password:     c.Password,
	}
	res := &contestant.SignupResponse{}

	hres, err := ProtobufRequest(ctx, c.Agent, http.MethodPost, "/api/signup", req, res, []int{200, 400})
	return res, hres, err
}

func LoginAction(ctx context.Context, c *model.Contestant) (*contestant.LoginResponse, error) {
	req := &contestant.LoginRequest{
		ContestantId: c.ID,
		Password:     c.Password,
	}
	res := &contestant.LoginResponse{}

	_, err := ProtobufRequest(ctx, c.Agent, http.MethodPost, "/api/login", req, res, []int{200, 400})
	return res, err
}

func CreateTeamAction(ctx context.Context, team *model.Team, c *model.Contestant) (*registration.CreateTeamResponse, *http.Response, error) {
	req := &registration.CreateTeamRequest{
		TeamName:     team.TeamName,
		EmailAddress: team.EmailAddress,
		Name:         c.Name,
		IsStudent:    c.IsStudent,
	}
	res := &registration.CreateTeamResponse{}

	hres, err := ProtobufRequest(ctx, c.Agent, http.MethodPost, "/api/registration/team", req, res, []int{200, 403, 401})

	return res, hres, err
}

func GetRegistrationSession(ctx context.Context, c *model.Contestant) (*registration.GetRegistrationSessionResponse, error) {
	res := &registration.GetRegistrationSessionResponse{}

	_, err := ProtobufRequest(ctx, c.Agent, http.MethodGet, "/api/registration/session", nil, res, []int{200, 401, 403})
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

	_, err := ProtobufRequest(ctx, c.Agent, http.MethodPost, "/api/registration/contestant", req, res, []int{200, 400, 403, 401})
	return res, err
}

func EnqueueBenchmarkJobAction(ctx context.Context, team *model.Team) (*contestant.EnqueueBenchmarkJobResponse, error) {
	req := &contestant.EnqueueBenchmarkJobRequest{
		TargetHostname: team.TargetHost(),
	}
	res := &contestant.EnqueueBenchmarkJobResponse{}

	_, err := ProtobufRequest(ctx, team.Developer.Agent, http.MethodPost, "/api/contestant/benchmark_jobs", req, res, []int{200, 401, 403})

	return res, err
}

func GetDashboardAction(parent context.Context, team *model.Team, member *model.Contestant, timeout time.Duration) (*http.Response, *contestant.DashboardResponse, error) {
	req := &contestant.DashboardRequest{}
	res := &contestant.DashboardResponse{}

	ctx, cancel := context.WithTimeout(parent, timeout)
	defer cancel()
	hres, err := ProtobufRequest(ctx, member.Agent, http.MethodGet, "/api/contestant/dashboard", req, res, []int{200, 304, 401, 403})
	return hres, res, err
}

func GetBenchmarkJobs(ctx context.Context, team *model.Team, member *model.Contestant) (*contestant.ListBenchmarkJobsResponse, error) {
	req := &contestant.ListBenchmarkJobsRequest{}
	res := &contestant.ListBenchmarkJobsResponse{}

	_, err := ProtobufRequest(ctx, member.Agent, http.MethodGet, "/api/contestant/benchmark_jobs", req, res, []int{200, 304, 401, 403})
	return res, err
}

func GetBenchmarkJobAction(ctx context.Context, id int64, member *model.Contestant) (*contestant.GetBenchmarkJobResponse, error) {
	res := &contestant.GetBenchmarkJobResponse{}

	_, err := ProtobufRequest(ctx, member.Agent, http.MethodGet, fmt.Sprintf("/api/contestant/benchmark_jobs/%d", id), nil, res, []int{200, 401, 403, 404})
	return res, err
}

func GetClarificationsAction(ctx context.Context, member *model.Contestant) (*contestant.ListClarificationsResponse, error) {
	res := &contestant.ListClarificationsResponse{}

	_, err := ProtobufRequest(ctx, member.Agent, http.MethodGet, "/api/contestant/clarifications", nil, res, []int{200, 401, 403})
	return res, err
}

func PostClarificationAction(ctx context.Context, member *model.Contestant, clar *model.Clarification) (*contestant.RequestClarificationResponse, error) {
	req := &contestant.RequestClarificationRequest{
		Question: clar.Question,
	}
	res := &contestant.RequestClarificationResponse{}

	_, err := ProtobufRequest(ctx, member.Agent, http.MethodPost, "/api/contestant/clarifications", req, res, []int{200, 401, 403})
	return res, err
}

func AdminGetClarificationsAction(ctx context.Context, member *model.Contestant) (*admin.ListClarificationsResponse, error) {
	req := &admin.ListClarificationsRequest{}
	res := &admin.ListClarificationsResponse{}

	_, err := ProtobufRequest(ctx, member.Agent, http.MethodGet, "/api/admin/clarifications", req, res, []int{200, 401, 403})
	return res, err
}

func AdminGetClarificationAction(ctx context.Context, id int64, member *model.Contestant) (*admin.GetClarificationResponse, error) {
	req := &admin.GetClarificationRequest{}
	res := &admin.GetClarificationResponse{}

	_, err := ProtobufRequest(ctx, member.Agent, http.MethodGet, fmt.Sprintf("/api/admin/clarifications/%d", id), req, res, []int{200, 401, 403})
	return res, err
}

func AdminPostClarificationAction(ctx context.Context, member *model.Contestant, clar *model.Clarification) (*admin.RespondClarificationResponse, error) {
	req := &admin.RespondClarificationRequest{
		Id:       clar.ID(),
		Disclose: clar.Disclose,
		Answer:   clar.Answer,
	}
	res := &admin.RespondClarificationResponse{}

	_, err := ProtobufRequest(ctx, member.Agent, http.MethodPut, fmt.Sprintf("/api/admin/clarifications/%d", clar.ID()), req, res, []int{200, 401, 403, 404})
	return res, err
}

func AudienceGetDashboardAction(parent context.Context, agent *agent.Agent, timeout time.Duration) (*http.Response, *audience.DashboardResponse, error) {
	req := &audience.DashboardRequest{}
	res := &audience.DashboardResponse{}

	ctx, cancel := context.WithTimeout(parent, timeout)
	defer cancel()
	hres, err := ProtobufRequest(ctx, agent, http.MethodGet, "/api/audience/dashboard", req, res, []int{200, 304})
	return hres, res, err
}

func SubscribeNotification(ctx context.Context, member *model.Contestant, pushSubscription *pushserver.Subscription) (*contestant.SubscribeNotificationResponse, *http.Response, error) {
	req := &contestant.SubscribeNotificationRequest{
		Endpoint: pushSubscription.GetURL(),
		P256Dh:   pushSubscription.GetP256DH(),
		Auth:     pushSubscription.GetAuth(),
	}
	res := &contestant.SubscribeNotificationResponse{}
	hres, err := ProtobufRequest(ctx, member.Agent, http.MethodPost, "/api/contestant/push_subscriptions", req, res, []int{200, 401, 403, 503})
	return res, hres, err
}

func GetNotifications(ctx context.Context, member *model.Contestant) (*contestant.ListNotificationsResponse, error) {
	res := &contestant.ListNotificationsResponse{}
	reqPath := "/api/contestant/notifications"
	latestID := member.LatestNotificationID()
	if latestID > 0 {
		reqPath = fmt.Sprintf("/api/contestant/notifications?after=%d", latestID)
	}
	_, err := ProtobufRequest(ctx, member.Agent, http.MethodGet, reqPath, nil, res, []int{200, 304, 401, 403})
	return res, err
}
