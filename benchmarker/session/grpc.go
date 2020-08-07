package session

import (
	"bytes"
	"context"
	"github.com/golang/protobuf/proto"
	"io/ioutil"
)

type CallOption struct {
	Method string
	Path   string
	Req    proto.Message
	Res    proto.Message
}

func (s *Session) Call(ctx context.Context, method string, rpath string, msg proto.Message, res proto.Message) error {
	target := *s.baseURL
	if len(rpath) > 0 {
		target.Path = rpath
	}

	pb, err := proto.Marshal(msg)
	if err != nil {
		return err
	}
	body := bytes.NewBuffer(pb)

	httpreq, err := s.NewRequest(method, target, body)
	if err != nil {
		return err
	}

	httpreq.WithContext(ctx)
	httpreq.Header.Set("Content-Type", "application/vnd.google.protobuf")

	httpres, err := s.Do(httpreq)
	if err != nil {
		return err
	}

	respb, err := ioutil.ReadAll(httpres.Body)
	defer httpres.Body.Close()

	if err != nil {
		return err
	}

	return proto.Unmarshal(respb, res)
}
