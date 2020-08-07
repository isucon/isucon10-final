package main

import (
	"context"
	"fmt"
	"github.com/isucon/isucon10-final/benchmarker/session"
	"github.com/isucon/isucon10-final/proto/xsuportal/services/admin"
	"io/ioutil"
	"net/http"
)

func main() {
	s, _ := session.New("http://localhost:9292/")

	req := &admin.InitializeRequest{}
	res := &admin.InitializeResponse{}
	err := s.Call(context.Background(), http.MethodPost, "/initialize", req, res)
	if err != nil {
		fmt.Printf("%+v", err)
		return
	}

	fmt.Println(res.String())

	hres, err := s.Get("/packs/index.js")
	if err != nil {
		fmt.Printf("%+v", err)
		return
	}

	fmt.Printf("CE: %s\n", hres.Header.Get("Content-Encoding"))
	buf, err := ioutil.ReadAll(hres.Body)
	if err != nil {
		fmt.Printf("%+v", err)
		return
	}

	fmt.Printf("%s", buf)
}
