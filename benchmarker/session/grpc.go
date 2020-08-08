package session

import (
	"bytes"
	"context"
	"github.com/golang/protobuf/proto"
	"github.com/isucon/isucon10-final/proto/xsuportal"
	"io"
	"io/ioutil"
)

type CallOption struct {
	Method string
	Path   string
	Req    proto.Message
	Res    proto.Message
}

func (s *Session) Call(ctx context.Context, method string, rpath string, msg proto.Message, res proto.Message) (*xsuportal.Error, error) {
	target := *s.baseURL
	if len(rpath) > 0 {
		target.Path = rpath
	}

	var body io.Reader

	if msg != nil {
		pb, err := proto.Marshal(msg)
		if err != nil {
			return nil, err
		}
		body = bytes.NewBuffer(pb)
	} else {
		body = nil
	}

	httpreq, err := s.NewRequest(method, target, body)
	if err != nil {
		return nil, err
	}

	httpreq.WithContext(ctx)
	httpreq.Header.Set("Content-Type", "application/vnd.google.protobuf")

	httpres, err := s.Do(httpreq)
	if err != nil {
		return nil, err
	}

	respb, err := ioutil.ReadAll(httpres.Body)
	defer httpres.Body.Close()

	if err != nil {
		return nil, err
	}

	if httpres.Header.Get("Content-Type") == "application/vnd.google.protobuf; proto=xsuportal.proto.Error" {
		xError := &xsuportal.Error{}
		err := proto.Unmarshal(respb, xError)
		if err != nil {
			return nil, err
		}
		return xError, nil
	}

	return nil, proto.Unmarshal(respb, res)
}
