package main

import (
	"context"
	"fmt"
	"github.com/isucon/isucon10-final/benchmarker/model"
	"github.com/isucon/isucon10-final/benchmarker/session"
	"net/url"
	"time"
)

func main() {
	s, _ := session.NewBrowser("http://localhost:9292/")
	s2, _ := session.NewBrowser("http://localhost:9292/")
	s3, _ := session.NewBrowser("http://localhost:9292/")

	ctx := context.Background()
	var err error

	admin, _ := model.NewAdmin()
	s3.Contestant = admin

	contest := model.NewContest()

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

	contest.RegistrationOpenAt = time.Now().Add(-1 * time.Hour)
	contest.ContestStartsAt = time.Now().Add(-30 * time.Minute)
	contest.ContestFreezesAt = time.Now().Add(30 * time.Minute)
	contest.ContestEndsAt = time.Now().Add(1 * time.Hour)

	updateC, xerr, err := s3.UpdateContest(ctx, contest)
	if err != nil {
		fmt.Printf("%+v", err)
		return
	}
	fmt.Printf("%s\n", xerr.String())
	fmt.Printf("%s\n", updateC.String())

	enqueue, xerr, err := s.EnqueueBenchmarkJob(ctx, team)
	if err != nil {
		fmt.Printf("%+v", err)
		return
	}
	fmt.Printf("%s\n", xerr.String())
	fmt.Printf("%s\n", enqueue.String())

	list, xerr, err := s.ListBenchmarkJobs(ctx)
	if err != nil {
		fmt.Printf("%+v", err)
		return
	}
	fmt.Printf("%s\n", xerr.String())
	fmt.Printf("%s\n", list.String())

	jobId := list.GetJobs()[0].GetId()

	job, xerr, err := s.GetBenchmarkJob(ctx, jobId)
	if err != nil {
		fmt.Printf("%+v", err)
		return
	}
	fmt.Printf("%s\n", xerr.String())
	fmt.Printf("%s\n", job.String())

	benchmarker, err := session.NewBenchmarker(team, init.GetBenchmarkServer().GetHost(), init.GetBenchmarkServer().GetPort())
	if err != nil {
		fmt.Printf("%+v", err)
		return
	}

	err = benchmarker.Do(ctx)
	if err != nil {
		panic(err)
		fmt.Printf("%+v", err)
		return
	}

	logout, xerr, err := s.LogoutAction(ctx)
	if err != nil {
		fmt.Printf("%+v", err)
		return
	}
	fmt.Printf("%s\n", logout.String())
}
