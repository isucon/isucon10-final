package main

import (
	"context"
	"fmt"
	"github.com/isucon/isucon10-final/benchmarker/model"
	"github.com/isucon/isucon10-final/benchmarker/session"
	"net/url"
)

func main() {
	s, _ := session.New("http://localhost:9292/")
	s2, _ := session.New("http://localhost:9292/")

	ctx := context.Background()
	var err error

	init, _, err := s.InitializeAction(ctx)
	if err != nil {
		fmt.Printf("%+v", err)
		return
	}
	fmt.Printf("%s\n", init.String())

	team, _ := model.NewTeam()
	contestant := team.Leader
	s.Contestant = contestant
	s2.Contestant = team.Developer

	signup, xerr, err := s.SignupAction(ctx)
	if err != nil {
		fmt.Printf("%+v", err)
		return
	}
	fmt.Printf("%s\n", xerr.String())
	fmt.Printf("%s\n", signup.String())

	login, xerr, err := s.LoginAction(ctx)
	if err != nil {
		fmt.Printf("%+v", err)
		return
	}
	fmt.Printf("%s\n", xerr.String())
	fmt.Printf("%s\n", login.String())

	create, xerr, err := s.CreateTeam(ctx, team)
	if err != nil {
		fmt.Printf("%+v", err)
		return
	}
	fmt.Printf("%s\n", xerr.String())
	fmt.Printf("%s\n", create.String())

	rs, xerr, err := s.GetRegistrationSession(ctx)
	if err != nil {
		fmt.Printf("%+v", err)
		return
	}
	fmt.Printf("%s\n", xerr.String())
	fmt.Printf("%s\n", rs.String())

	s2.SignupAction(ctx)
	s2.LoginAction(ctx)

	inviteUrl, _ := url.Parse(rs.GetMemberInviteUrl())
	inviteToken := inviteUrl.Query().Get("invite_token")

	fmt.Printf("inviteToken: %s\n", inviteToken)
	join, xerr, err := s2.JoinTeam(ctx, team, inviteToken)
	if err != nil {
		fmt.Printf("%+v", err)
		return
	}
	fmt.Printf("%s\n", xerr.String())
	fmt.Printf("%s\n", join.String())

	team.TeamName = "白金動物園"
	update, xerr, err := s.UpdateRegistration(ctx, team)
	if err != nil {
		fmt.Printf("%+v", err)
		return
	}
	fmt.Printf("%s\n", xerr.String())
	fmt.Printf("%s\n", update.String())

	logout, xerr, err := s.LogoutAction(ctx)
	if err != nil {
		fmt.Printf("%+v", err)
		return
	}
	fmt.Printf("%s\n", logout.String())
}
