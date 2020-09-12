package scenario

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"

	"github.com/golang/protobuf/proto"
	"github.com/isucon/isucon10-final/benchmarker/proto/xsuportal"
	"github.com/rosylilly/isucandar/agent"
	"github.com/rosylilly/isucandar/failure"
)

var (
	ErrX403 failure.StringCode = "XSUPORTAL[403]"
)

type ProtobufError struct {
	XError *xsuportal.Error
}

func (p *ProtobufError) ErrorCode() string {
	return fmt.Sprintf("XSUPORTAL[%d]", p.XError.GetCode())
}

func (p *ProtobufError) Error() string {
	return p.XError.GetHumanMessage()
}

func ProtobufRequest(ctx context.Context, agent *agent.Agent, method string, rpath string, req proto.Message, res proto.Message) (*http.Response, error) {
	var body io.Reader = nil
	if req != nil {
		pw, err := proto.Marshal(req)
		if err != nil {
			return nil, err
		}
		body = bytes.NewReader(pw)
	}

	httpreq, err := agent.NewRequest(method, rpath, body)
	if err != nil {
		return nil, err
	}

	httpreq.Header.Set("Content-Type", "application/vnd.google.protobuf")

	httpres, err := agent.Do(ctx, httpreq)
	if err != nil {
		return nil, err
	}

	respb, err := ioutil.ReadAll(httpres.Body)
	defer httpres.Body.Close()

	if httpres.Header.Get("Content-Type") == "application/vnd.google.protobuf; proto=xsuportal.proto.Error" {
		xError := &xsuportal.Error{}
		err := proto.Unmarshal(respb, xError)
		if err != nil {
			return nil, err
		}
		return httpres, &ProtobufError{XError: xError}
	}

	return httpres, proto.Unmarshal(respb, res)
}
