package main

import (
	"bytes"
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"time"

	"github.com/golang/protobuf/proto"
	"google.golang.org/protobuf/types/known/timestamppb"

	"github.com/isucon/isucon10-final/webapp/golang/proto/xsuportal/resources"
	"github.com/isucon/isucon10-final/webapp/golang/proto/xsuportal/services/admin"
)

func main() {
	log.SetFlags(0)
	log.SetPrefix("initialize: ")
	if err := run(); err != nil {
		log.Fatal(err)
	}
}

func run() error {
	var flags struct {
		Host                 string
		InitialDuration      time.Duration
		RegistrationDuration time.Duration
		ContestDuration      time.Duration
		FreezesDuration      time.Duration
	}
	flag.StringVar(&flags.Host, "h", "localhost:9292", "アプリケーションサーバのアドレス")
	flag.DurationVar(&flags.InitialDuration, "init", 0*time.Second, "登録開始までの時間")
	flag.DurationVar(&flags.RegistrationDuration, "r", 1*time.Minute, "登録可能時間")
	flag.DurationVar(&flags.ContestDuration, "c", 20*time.Minute, "コンテスト時間")
	flag.DurationVar(&flags.FreezesDuration, "f", 1*time.Minute, "凍結時間")
	flag.Parse()

	now := time.Now().UTC()
	registrationOpenAt := now.Add(flags.InitialDuration)
	contestStartsAt := registrationOpenAt.Add(flags.RegistrationDuration)
	contestEndsAt := contestStartsAt.Add(flags.ContestDuration)
	contestFreezesAt := contestEndsAt.Add(-1 * flags.FreezesDuration)

	req := admin.InitializeRequest{
		Contest: &resources.Contest{
			RegistrationOpenAt: timestamppb.New(registrationOpenAt),
			ContestStartsAt:    timestamppb.New(contestStartsAt),
			ContestFreezesAt:   timestamppb.New(contestFreezesAt),
			ContestEndsAt:      timestamppb.New(contestEndsAt),
		},
	}
	endpoint := &url.URL{Scheme: "http", Host: flags.Host, Path: "/initialize"}
	m, err := proto.Marshal(&req)
	if err != nil {
		return fmt.Errorf("marshal initialize request: %w", err)
	}
	resp, err := http.Post(endpoint.String(), "application/vnd.google.protobuf", bytes.NewReader(m))
	if err != nil {
		return fmt.Errorf("post /initialize: %w", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("unexpected status code(expected=%v, got=%v)", http.StatusOK, resp.StatusCode)
	}
	b, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("read response body: %w", err)
	}
	var r admin.InitializeResponse
	if err := proto.Unmarshal(b, &r); err != nil {
		return fmt.Errorf("unmarshal initialize response: %w", err)
	}
	fmt.Printf("%s\n", r.String())
	return nil
}
