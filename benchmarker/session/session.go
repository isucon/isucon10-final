package session

import (
	"github.com/isucon/isucon10-final/benchmarker/failure"
	"io"
	"net"
	"net/http"
	"net/http/cookiejar"
	"net/url"
	"time"
)

const (
	SESSION_REQUEST_TIMEOUT = 10 * time.Second
)

type Session struct {
	baseURL    *url.URL
	httpClient *http.Client
}

func New(base string) (*Session, error) {
	baseURL, err := url.Parse(base)
	if err != nil {
		return nil, err
	}

	jar, err := cookiejar.New(&cookiejar.Options{})
	if err != nil {
		return nil, err
	}

	s := &Session{
		baseURL: baseURL,
		httpClient: &http.Client{
			Transport: &http.Transport{},
			Jar:       jar,
			Timeout:   SESSION_REQUEST_TIMEOUT,
		},
	}

	return s, nil
}

func (s *Session) Do(req *http.Request) (*http.Response, error) {
	res, err := s.httpClient.Do(req)

	if err != nil {
		if nerr, ok := err.(net.Error); ok {
			if nerr.Timeout() {
				return nil, failure.Translate(err, failure.ErrTimeout)
			} else if nerr.Temporary() {
				return nil, failure.Translate(err, failure.ErrTemporary)
			}
		}

		return nil, err
	}

	return res, nil
}

func (s *Session) NewGetRequest(rpath string) (*http.Request, error) {
	target := *s.baseURL
	if len(rpath) > 0 {
		target.Path = rpath
	}

	req, err := http.NewRequest(http.MethodGet, target.String(), nil)
	if err != nil {
		return nil, err
	}

	return req, nil
}

func (s *Session) NewGetRequestWithQuery(rpath string, q url.Values) (*http.Request, error) {
	target := *s.baseURL
	if len(rpath) > 0 {
		target.Path = rpath
	}

	target.RawQuery = q.Encode()

	req, err := http.NewRequest(http.MethodGet, target.String(), nil)
	if err != nil {
		return nil, err
	}

	return req, nil
}

func (s *Session) NewPostRequest(rpath string, contentType string, body io.Reader) (*http.Request, error) {
	target := *s.baseURL
	if len(rpath) > 0 {
		target.Path = rpath
	}

	req, err := http.NewRequest(http.MethodPost, target.String(), body)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", contentType)

	return req, nil
}

func (s *Session) Get(rpath string) (*http.Response, error) {
	req, err := s.NewGetRequest(rpath)
	if err != nil {
		return nil, err
	}

	return s.Do(req)
}

func (s *Session) GetWithQuery(rpath string, q url.Values) (*http.Response, error) {
	req, err := s.NewGetRequestWithQuery(rpath, q)
	if err != nil {
		return nil, err
	}

	return s.Do(req)
}

func (s *Session) Post(rpath string, contentType string, body io.Reader) (*http.Response, error) {
	req, err := s.NewPostRequest(rpath, contentType, body)
	if err != nil {
		return nil, err
	}

	return s.Do(req)
}
