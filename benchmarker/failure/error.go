package failure

import (
	"context"
	"github.com/morikuni/failure"
	"sync"
)

const ILLEGAL_ERROR = "想定外のエラーです。大会運営委員会へ連絡してください。"

const (
	ErrCritical    failure.StringCode = "Critical Error"
	ErrApplication failure.StringCode = "Application Error"
	ErrTimeout     failure.StringCode = "Timeout Error"
	ErrTemporary   failure.StringCode = "Temporary Error"
)

type Errors struct {
	Messages []string

	critical    int
	application int
	trivial     int

	mu sync.Mutex
}

func NewErrors() *Errors {
	messages := make([]string, 0, 100)

	return &Errors{
		Messages:    messages,
		critical:    0,
		application: 0,
		trivial:     0,
		mu:          sync.Mutex{},
	}
}

func (e *Errors) GetMessages() (msgs []string) {
	e.mu.Lock()
	defer e.mu.Unlock()

	return e.Messages[:]
}

func (e *Errors) Len() int {
	e.mu.Lock()
	defer e.mu.Unlock()

	return e.critical + e.application + e.trivial
}

func (e *Errors) Get() (msgs []string, critical, application, trivial int) {
	e.mu.Lock()
	defer e.mu.Unlock()

	return e.Messages[:], e.critical, e.application, e.trivial
}

func (e *Errors) Add(err error) {
	if err == nil {
		return
	}

	if err == context.Canceled {
		return
	}

	e.mu.Lock()
	defer e.mu.Unlock()

	code, ok := failure.CodeOf(err)
	msg, _ := failure.MessageOf(err)

	if ok {
		switch code {
		case ErrCritical:
			msg += " [CRITICAL]"
			e.critical++
		case ErrTimeout:
			msg += " [TIMEOUT]"
			e.trivial++
		case ErrTemporary:
			msg += " [TEMPORARY]"
			e.trivial++
		case ErrApplication:
			e.application++
		default:
			e.application++
		}

		e.Messages = append(e.Messages, msg)
	} else {
		e.critical++
		e.Messages = append(e.Messages, ILLEGAL_ERROR)
	}
}

func New(code failure.Code, message string) error {
	return failure.New(code, failure.Message(message))
}

func Translate(err error, code failure.StringCode) error {
	return failure.Custom(err, failure.WithCode(code), failure.WithFormatter(), failure.WithCallStackSkip(1))
}
