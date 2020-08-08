package session

import (
	"context"
	"github.com/isucon/isucon10-final/proto/xsuportal"
	"github.com/isucon/isucon10-final/proto/xsuportal/services/admin"
	"github.com/isucon/isucon10-final/proto/xsuportal/services/contestant"
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
		Password:     s.Contestant.Password + ".error",
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
