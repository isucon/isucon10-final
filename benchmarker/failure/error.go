package failure

import (
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

type Error struct {
	Messages []string

	critical    int
	application int
	trivial     int

	mu sync.Mutex
}

func New() *Error {
	messages := make([]string, 0, 100)

	return &Error{
		Messages:    messages,
		critical:    0,
		application: 0,
		trivial:     0,
		mu:          sync.Mutex{},
	}
}

func (e *Error) GetMessages() (msgs []string) {
	e.mu.Lock()
	defer e.mu.Unlock()

	return e.Messages[:]
}

func (e *Error) Get() (msgs []string, critical, application, trivial int) {
	e.mu.Lock()
	defer e.mu.Unlock()

	return e.Messages[:], e.critical, e.application, e.trivial
}

func (e *Error) Add(err error) {
	if err == nil {
		return
	}

	e.mu.Lock()
	defer e.mu.Unlock()

	msg, ok := failure.MessageOf(err)
	code, _ := failure.CodeOf(err)

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

func Translate(err error, code failure.StringCode) error {
	return failure.Translate(err, code)
}
