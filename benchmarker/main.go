package main

import (
	"context"
	"fmt"
	"github.com/isucon/isucon10-final/benchmarker/model"
	"github.com/isucon/isucon10-final/benchmarker/session"
)

func main() {
	s, _ := session.New("http://localhost:9292/")

	ctx := context.Background()
	var err error

	init, _, err := s.InitializeAction(ctx)
	if err != nil {
		fmt.Printf("%+v", err)
		return
	}
	fmt.Printf("%s\n", init.String())

	contestant, _ := model.NewContestant()
	s.Contestant = contestant

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

	logout, xerr, err := s.LogoutAction(ctx)
	if err != nil {
		fmt.Printf("%+v", err)
		return
	}
	fmt.Printf("%s\n", logout.String())
}
