package session

import (
	"bytes"
	"compress/flate"
	"compress/gzip"
	"context"
	"fmt"
	"github.com/andybalholm/brotli"
	"github.com/golang/protobuf/proto"
	"github.com/isucon/isucon10-final/benchmarker/failure"
	"github.com/isucon/isucon10-final/benchmarker/model"
	"github.com/isucon/isucon10-final/proto/xsuportal"
	"io"
	"io/ioutil"
	"net"
	"net/http"
	"net/url"
	"strings"
	"sync"
	"time"
)

const (
	SESSION_REQUEST_TIMEOUT = 10 * time.Second
)

type Browser struct {
	baseURL    *url.URL
	lock       sync.Mutex
	httpClient *http.Client

	Contestant *model.Contestant
}

func NewBrowser(base string) (*Browser, error) {
	baseURL, err := url.Parse(base)
	if err != nil {
		return nil, err
	}

	s := &Browser{
		baseURL: baseURL,
		lock:    sync.Mutex{},
		httpClient: &http.Client{
			Transport: &http.Transport{
				DisableCompression: true,
			},
			Timeout: SESSION_REQUEST_TIMEOUT,
		},
	}

	return s, nil
}

func (s *Browser) Do(ctx context.Context, req *http.Request) (*http.Response, error) {
	s.lock.Lock()
	defer s.lock.Unlock()

	req = req.WithContext(ctx)

	if s.Contestant != nil {
		s.httpClient.Jar = s.Contestant.CookieJar
	}
	res, err := s.httpClient.Do(req)

	if err != nil {
		if nerr, ok := err.(net.Error); ok {
			if nerr.Timeout() {
				return nil, failure.New(failure.ErrTimeout, fmt.Sprintf("%s: %s", req.Method, req.URL.String()))
			} else if nerr.Temporary() {
				return nil, failure.New(failure.ErrTemporary, fmt.Sprintf("%s: %s", req.Method, req.URL.String()))
			}
		}

		return nil, err
	}

	contentEncoding := res.Header.Get("Content-Encoding")
	if strings.EqualFold(contentEncoding, "br") {
		res.Body = &bReader{r: res.Body}
		res.Header.Del("Content-Length")
		res.ContentLength = -1
		res.Uncompressed = true
	} else if strings.EqualFold(contentEncoding, "gzip") {
		res.Body, err = gzip.NewReader(res.Body)
		if err != nil {
			return nil, err
		}
		res.Header.Del("Content-Length")
		res.ContentLength = -1
		res.Uncompressed = true
	} else if strings.EqualFold(contentEncoding, "deflate") {
		res.Body = flate.NewReader(res.Body)
		res.Header.Del("Content-Length")
		res.ContentLength = -1
		res.Uncompressed = true
	}

	return res, nil
}

func (s *Browser) NewRequest(method string, target url.URL, body io.Reader) (*http.Request, error) {
	req, err := http.NewRequest(method, target.String(), body)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Accept-Encoding", "gzip, deflate, br")

	return req, nil
}

func (s *Browser) NewGetRequest(rpath string) (*http.Request, error) {
	target := *s.baseURL
	if len(rpath) > 0 {
		target.Path = rpath
	}

	req, err := s.NewRequest(http.MethodGet, target, nil)
	if err != nil {
		return nil, err
	}

	return req, nil
}

func (s *Browser) NewGetRequestWithQuery(rpath string, q url.Values) (*http.Request, error) {
	target := *s.baseURL
	if len(rpath) > 0 {
		target.Path = rpath
	}

	target.RawQuery = q.Encode()

	req, err := s.NewRequest(http.MethodGet, target, nil)
	if err != nil {
		return nil, err
	}

	return req, nil
}

func (s *Browser) NewPostRequest(rpath string, contentType string, body io.Reader) (*http.Request, error) {
	target := *s.baseURL
	if len(rpath) > 0 {
		target.Path = rpath
	}

	req, err := s.NewRequest(http.MethodPost, target, body)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", contentType)

	return req, nil
}

func (s *Browser) Get(ctx context.Context, rpath string) (*http.Response, error) {
	req, err := s.NewGetRequest(rpath)
	if err != nil {
		return nil, err
	}

	return s.Do(ctx, req)
}

func (s *Browser) GetWithQuery(ctx context.Context, rpath string, q url.Values) (*http.Response, error) {
	req, err := s.NewGetRequestWithQuery(rpath, q)
	if err != nil {
		return nil, err
	}

	return s.Do(ctx, req)
}

func (s *Browser) Post(ctx context.Context, rpath string, contentType string, body io.Reader) (*http.Response, error) {
	req, err := s.NewPostRequest(rpath, contentType, body)
	if err != nil {
		return nil, err
	}

	return s.Do(ctx, req)
}

type bReader struct {
	br *brotli.Reader
	r  io.ReadCloser
}

func (br *bReader) Read(p []byte) (n int, err error) {
	if br.br == nil {
		br.br = brotli.NewReader(br.r)
	}

	return br.br.Read(p)
}

func (br *bReader) Close() error {
	return br.r.Close()
}

func (s *Browser) GRPC(ctx context.Context, method string, rpath string, msg proto.Message, res proto.Message) (*xsuportal.Error, error) {
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

	httpreq.Header.Set("Content-Type", "application/vnd.google.protobuf")

	httpres, err := s.Do(ctx, httpreq)
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
