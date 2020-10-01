package scenario

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"

	"github.com/golang/protobuf/proto"
	"github.com/isucon/isucandar/agent"
	"github.com/isucon/isucandar/failure"
	"github.com/isucon/isucon10-final/benchmarker/proto/xsuportal"
)

var (
	ErrX400 failure.StringCode = "XSUPORTAL[400]"
	ErrX401 failure.StringCode = "XSUPORTAL[401]"
	ErrX402 failure.StringCode = "XSUPORTAL[402]"
	ErrX403 failure.StringCode = "XSUPORTAL[403]"
	ErrX404 failure.StringCode = "XSUPORTAL[404]"
	ErrX503 failure.StringCode = "XSUPORTAL[503]"

	ErrX5XX     failure.StringCode = "http-server-error"
	ErrProtobuf failure.StringCode = "protobuf-decode"
)

type ProtobufError struct {
	XError *xsuportal.Error
	Method string
	Path   string
}

func (p *ProtobufError) ErrorCode() string {
	return fmt.Sprintf("XSUPORTAL[%d]", p.XError.GetCode())
}

func (p *ProtobufError) Error() string {
	return fmt.Sprintf("%s: %s(%s %s)", p.ErrorCode(), p.XError.GetHumanMessage(), p.Method, p.Path)
}

func ProtobufRequest(ctx context.Context, agent *agent.Agent, method string, rpath string, req proto.Message, res proto.Message, allowedStatuCodes []int) (*http.Response, error) {
	var body io.Reader = nil
	if req != nil {
		pw, err := proto.Marshal(req)
		if err != nil {
			return nil, failure.NewError(ErrHTTP, err)
		}
		body = bytes.NewReader(pw)
	}

	httpreq, err := agent.NewRequest(method, rpath, body)
	if err != nil {
		return nil, failure.NewError(ErrHTTP, err)
	}

	httpreq.Header.Set("Accept", "application/vnd.google.protobuf, text/plain")
	httpreq.Header.Set("Content-Type", "application/vnd.google.protobuf")

	httpres, err := agent.Do(ctx, httpreq)
	if err != nil {
		return nil, failure.NewError(ErrHTTP, err)
	}
	defer httpres.Body.Close()

	invalidStatusCode := true
	for _, statusCode := range allowedStatuCodes {
		if httpres.StatusCode == statusCode || (statusCode == 200 && httpres.StatusCode == 304) {
			invalidStatusCode = false
		}
	}
	if invalidStatusCode {
		return nil, failure.NewError(ErrX5XX, fmt.Errorf("不正な HTTP ステータスコード: %d (%s: %s)", httpres.StatusCode, httpreq.Method, httpreq.URL.Path))
	}

	respb, err := ioutil.ReadAll(httpres.Body)
	if err != nil {
		return nil, failure.NewError(ErrHTTP, err)
	}

	if httpres.Header.Get("Content-Type") == "application/vnd.google.protobuf; proto=xsuportal.proto.Error" {
		xError := &xsuportal.Error{}
		err := proto.Unmarshal(respb, xError)
		if err != nil {
			return httpres, failure.NewError(ErrProtobuf, fmt.Errorf("Protobuf のデコードに失敗しました(%s %s): %v", httpreq.Method, httpreq.URL.Path, err))
		}
		return httpres, &ProtobufError{XError: xError, Method: httpreq.Method, Path: httpreq.URL.Path}
	}

	if err := proto.Unmarshal(respb, res); err != nil {
		return httpres, failure.NewError(ErrProtobuf, fmt.Errorf("Protobuf のデコードに失敗しました(%s %s): %v", httpreq.Method, httpreq.URL.Path, err))
	}

	return httpres, nil
}
